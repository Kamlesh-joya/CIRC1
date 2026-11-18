#!/usr/bin/env python3
"""
CircuitCare - Excel Catalogue Import Engine
Reads CircuitCare_Services(1).xlsx (or path provided via CLI)
Extracts rows starting from row 8 with headers at row 7.
Preserves:
- Service ID
- Device category
- Service name
- Website price (null if blank, NEVER 0 or 'Free')
- Suggested pricing basis
- Charging unit
- Proposed scope / inclusion
- Parts & consumables

Strips:
- Labour only pricing
- Readiness review
- Notes / approvals
- Reference URL
- Evidence basis
"""

import sys
import os
import zipfile
import xml.etree.ElementTree as ET
import json

def get_excel_path():
    if len(sys.argv) > 1 and os.path.exists(sys.argv[1]):
        return sys.argv[1]
    
    # Check default locations
    candidates = [
        os.path.join(os.path.dirname(__file__), '..', '..', 'CircuitCare_Services(1).xlsx'),
        os.path.join(os.path.dirname(__file__), '..', 'data', 'CircuitCare_Services(1).xlsx'),
        'CircuitCare_Services(1).xlsx'
    ]
    for c in candidates:
        if os.path.exists(c):
            return os.path.abspath(c)
    raise FileNotFoundError("Could not find CircuitCare_Services(1).xlsx. Please pass path as argument.")

def import_services():
    xlsx_path = get_excel_path()
    print(f"Reading services from: {xlsx_path}")

    with zipfile.ZipFile(xlsx_path, 'r') as z:
        # 1. Parse shared strings
        shared_strings = []
        if 'xl/sharedStrings.xml' in z.namelist():
            tree = ET.fromstring(z.read('xl/sharedStrings.xml'))
            for si in tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
                text = ''.join([elem.text or '' for elem in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t')])
                shared_strings.append(text)
        
        # 2. Parse sheet1
        sheet_file = 'xl/worksheets/sheet1.xml'
        if sheet_file not in z.namelist():
            # Find first sheet
            sheets = [s for s in z.namelist() if s.startswith('xl/worksheets/sheet')]
            sheet_file = sheets[0]

        tree = ET.fromstring(z.read(sheet_file))
        rows = tree.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheetData/{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')

        services = []
        category_counts = {}

        for r in rows:
            r_idx = int(r.attrib.get('r', 0))
            if r_idx < 8:
                continue

            c_map = {}
            for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                r_attr = c.attrib.get('r', '')
                col = ''.join([ch for ch in r_attr if ch.isalpha()])
                t_attr = c.attrib.get('t')
                v_el = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                v_val = v_el.text if v_el is not None else ''
                if t_attr == 's' and v_val.isdigit():
                    c_map[col] = shared_strings[int(v_val)].strip()
                else:
                    c_map[col] = v_val.strip()

            service_id = c_map.get('A', '')
            if not service_id.startswith('CC-'):
                continue

            category = c_map.get('B', '')
            name = c_map.get('C', '')
            raw_price = c_map.get('D', '')
            pricing_basis = c_map.get('F', '')
            charging_unit = c_map.get('G', '')
            scope = c_map.get('H', '')
            parts = c_map.get('I', '')

            # Website price handling:
            # If blank, None. If number, parse. Never 0 or 'Free'
            website_price = None
            if raw_price:
                try:
                    num = float(raw_price)
                    website_price = int(num) if num.is_integer() else num
                except ValueError:
                    website_price = raw_price

            category_counts[category] = category_counts.get(category, 0) + 1
            services.append({
                'id': service_id,
                'category': category,
                'name': name,
                'websitePrice': website_price,
                'pricingBasis': pricing_basis,
                'chargingUnit': charging_unit,
                'scope': scope,
                'partsAndConsumables': parts
            })

    output_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    services_path = os.path.join(output_dir, 'services.json')

    with open(services_path, 'w', encoding='utf-8') as f:
        json.dump(services, f, indent=2, ensure_ascii=False)

    print(f"Successfully processed {len(services)} services across {len(category_counts)} categories.")
    print(f"Saved: {services_path}")

    # Generate / update categories.json
    category_metadata = {
        'Laptop': {
            'slug': 'laptop',
            'icon': 'Laptop',
            'image': '/assets/images/cat-laptop.jpg',
            'tagline': 'Screen, battery, motherboard & thermal servicing'
        },
        'Desktop PC': {
            'slug': 'desktop-pc',
            'icon': 'Monitor',
            'image': '/assets/images/cat-pc.jpg',
            'tagline': 'Custom assembly, upgrades, PSU & troubleshooting'
        },
        'AC': {
            'slug': 'ac',
            'icon': 'Wind',
            'image': '/assets/images/cat-ac.png',
            'tagline': 'Split & window deep cleaning, gas refill & installation'
        },
        'Refrigerator': {
            'slug': 'refrigerator',
            'icon': 'Refrigerator',
            'image': '/assets/images/cat-fridge.jpg',
            'tagline': 'Cooling diagnosis, compressor & gasket repairs'
        },
        'Washing Machine': {
            'slug': 'washing-machine',
            'icon': 'WashingMachine',
            'image': '/assets/images/cat-washing.jpg',
            'tagline': 'Drum, pump, motor & top/front-load deep cleaning'
        },
        'Air Cooler': {
            'slug': 'air-cooler',
            'icon': 'Fan',
            'image': '/assets/images/cat-cooler.jpg',
            'tagline': 'Seasonal setup, pump & cooling pad replacement'
        },
        'UPS & Inverter': {
            'slug': 'ups-inverter',
            'icon': 'BatteryCharging',
            'image': '/assets/images/cat-ups.jpg',
            'tagline': 'Battery health test, load check & PCB repair'
        },
        'CCTV': {
            'slug': 'cctv',
            'icon': 'Camera',
            'image': '/assets/images/cat-cctv.jpg',
            'tagline': 'Camera installation, DVR/NVR setup & cabling'
        },
        'Networking': {
            'slug': 'networking',
            'icon': 'Wifi',
            'image': '/assets/images/cat-network.jpg',
            'tagline': 'Wi-Fi optimisation, router setup & LAN points'
        },
        'TV & Audio': {
            'slug': 'tv-audio',
            'icon': 'Tv',
            'image': '/assets/images/cat-tv.jpg',
            'tagline': 'Wall mounting, backlight repair & board diagnosis'
        },
        'Water Purifier': {
            'slug': 'water-purifier',
            'icon': 'Droplets',
            'image': '/assets/images/cat-ro.jpg',
            'tagline': 'RO membrane, filter replacement & sanitisation'
        },
        'Geyser': {
            'slug': 'geyser',
            'icon': 'Flame',
            'image': '/assets/images/cat-geyser.jpg',
            'tagline': 'Heating element, thermostat & descaling service'
        },
        'Kitchen Appliances': {
            'slug': 'kitchen-appliances',
            'icon': 'Utensils',
            'image': '/assets/images/cat-kitchen.jpg',
            'tagline': 'Chimney cleaning, microwave & induction repairs'
        },
        'Printer & Scanner': {
            'slug': 'printer-scanner',
            'icon': 'Printer',
            'image': '/assets/images/cat-printer.jpg',
            'tagline': 'Head cleaning, roller replacement & ink refill'
        },
        'Mobile & Tablet': {
            'slug': 'mobile-tablet',
            'icon': 'Smartphone',
            'image': '/assets/images/cat-mobile.jpg',
            'tagline': 'Screen, battery, charging port & diagnostic checks'
        },
        'Small Appliances': {
            'slug': 'small-appliances',
            'icon': 'Sparkles',
            'image': '/assets/images/cat-small.jpg',
            'tagline': 'Mixer grinder, fans, electric irons & air purifiers'
        }
    }

    categories = []
    for cat_name, count in sorted(category_counts.items()):
        meta = category_metadata.get(cat_name, {
            'slug': cat_name.lower().replace(' ', '-').replace('&', 'and'),
            'icon': 'Wrench',
            'image': '/assets/images/cat-laptop.jpg',
            'tagline': f'Professional {cat_name} services in Jaipur'
        })
        categories.append({
            'name': cat_name,
            'slug': meta['slug'],
            'icon': meta['icon'],
            'image': meta['image'],
            'tagline': meta['tagline'],
            'serviceCount': count
        })

    cat_path = os.path.join(output_dir, 'categories.json')
    with open(cat_path, 'w', encoding='utf-8') as f:
        json.dump(categories, f, indent=2, ensure_ascii=False)
    print(f"Saved: {cat_path}")

    # Also sync to frontend public data or src so the build has both direct access and API access!
    frontend_data_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'frontend', 'src', 'data')
    os.makedirs(frontend_data_dir, exist_ok=True)
    with open(os.path.join(frontend_data_dir, 'services.json'), 'w', encoding='utf-8') as f:
        json.dump(services, f, indent=2, ensure_ascii=False)
    with open(os.path.join(frontend_data_dir, 'categories.json'), 'w', encoding='utf-8') as f:
        json.dump(categories, f, indent=2, ensure_ascii=False)
    print(f"Synced to frontend data directory: {frontend_data_dir}")

if __name__ == '__main__':
    import_services()
