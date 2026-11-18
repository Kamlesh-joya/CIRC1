import { EnquiryModel } from '../models/Enquiry.model.js';
import { BRAND_CONFIG } from '../config/brand.config.js';

export const enquiryController = {
  /**
   * POST /api/enquiry/prepare
   * Validates enquiry details and prepares WhatsApp redirect URL & fallback copy text.
   * Requires authenticated session/user.
   */
  async prepareEnquiry(req, res, next) {
    try {
      const data = req.body;

      // Validate required fields
      const validation = EnquiryModel.validate(data);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Format WhatsApp message
      const formattedMessage = EnquiryModel.formatMessage(data);
      const whatsappUrl = EnquiryModel.generateWhatsAppUrl(formattedMessage);

      // Save audit record (optional server-side history)
      const userId = req.user ? req.user.id : null;
      const audit = EnquiryModel.saveAuditRecord(data, userId);

      return res.json({
        success: true,
        message: 'Enquiry validated successfully',
        data: {
          whatsappUrl,
          messageText: formattedMessage,
          businessPhone: BRAND_CONFIG.businessPhone,
          helperText: BRAND_CONFIG.whatsappHelperText,
          serviceNotice: BRAND_CONFIG.serviceNotice,
          auditId: audit ? audit.id : null
        }
      });
    } catch (err) {
      return next(err);
    }
  }
};

export default enquiryController;
