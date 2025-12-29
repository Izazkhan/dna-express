/**
 * AutoIdValidatorMiddleware
 * Encapsulates logic to automatically validate and sanitize ID-based parameters.
 */
class AutoIdValidatorMiddleware {
  /**
   * @param {Object} options 
   * @param {Array} options.exclude - Parameter names to skip validation for (e.g., ['session_id'])
   */
  constructor(options = {}) {
    this.exclude = options.exclude || [];
  }

  /**
   * The main middleware function
   */
  validate = (req, res, next) => {
    const params = req.params;

    for (const key in params) {
      const isIdParam = key.toLowerCase().includes('id');
      const isExcluded = this.exclude.includes(key);

      if (isIdParam && !isExcluded) {
        const value = params[key];

        // Regex for BigInt safety: allows only digits 0-9
        if (!/^\d+$/.test(value)) {
          return res.status(400).json({
            status: 'error',
            code: 'INVALID_ID_FORMAT',
            message: `Parameter '${key}' must be a numeric integer. Received: '${value}'`
          });
        }
      }
    }

    next();
  };
}

export default new AutoIdValidatorMiddleware;