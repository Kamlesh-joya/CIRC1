import { CatalogModel } from '../models/Catalog.model.js';

export const catalogController = {
  /**
   * GET /api/services
   * Query params: category, search, pricingBasis
   */
  async getServices(req, res, next) {
    try {
      const { category, search, pricingBasis } = req.query;
      const services = CatalogModel.findServices({ category, search, pricingBasis });

      return res.json({
        success: true,
        count: services.length,
        data: services
      });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * GET /api/services/:id
   */
  async getServiceById(req, res, next) {
    try {
      const { id } = req.params;
      const service = CatalogModel.findServiceById(id);

      if (!service) {
        return res.status(404).json({
          success: false,
          message: `Service with ID '${id}' not found`
        });
      }

      return res.json({
        success: true,
        data: service
      });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * GET /api/categories
   */
  async getCategories(req, res, next) {
    try {
      const categories = CatalogModel.getCategories();
      return res.json({
        success: true,
        count: categories.length,
        data: categories
      });
    } catch (err) {
      return next(err);
    }
  },

  /**
   * GET /api/services/popular
   */
  async getPopularServices(req, res, next) {
    try {
      const popular = CatalogModel.getPopularServices();
      return res.json({
        success: true,
        count: popular.length,
        data: popular
      });
    } catch (err) {
      return next(err);
    }
  }
};

export default catalogController;
