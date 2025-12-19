const vnSmartBotProvider = require('../providers/VnSmartBotProvider');

/**
 * Controller xử lý tương tác với vnSmartBot
 */
class VnSmartBotController {
  /**
   * Gửi tin nhắn đến bot và nhận response streaming qua SSE
   * POST /api/smartbot/conversation/stream
   */
  async conversationStream(req, res) {
    try {
      const {
        sender_id,
        text,
        input_channel,
        metadata,
        session_id,
        bot_id,
        settings,
      } = req.body;

      // Validate required fields
      if (!sender_id || !text) {
        return res.status(400).json({
          success: false,
          message: 'sender_id and text are required',
        });
      }

      // Setup SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering in nginx

      // Gửi tin nhắn và stream response
      await vnSmartBotProvider.sendMessageStreaming(
        {
          sender_id,
          text,
          input_channel,
          metadata,
          session_id,
          bot_id,
          settings,
        },
        // onData callback
        (data) => {
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        },
        // onEnd callback
        () => {
          res.write('data: [DONE]\n\n');
          res.end();
        },
        // onError callback
        (error) => {
          console.error('Streaming error:', error);
          res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
          res.end();
        }
      );
    } catch (error) {
      console.error('Error in conversationStream:', error);
      
      // Nếu chưa gửi headers thì gửi JSON error
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error processing conversation',
          error: error.message,
        });
      } else {
        res.end();
      }
    }
  }

  /**
   * Gửi tin nhắn đến bot và nhận response thông thường (không streaming)
   * POST /api/smartbot/conversation
   */
  async conversation(req, res) {
    try {
      const {
        sender_id,
        text,
        input_channel,
        metadata,
        session_id,
        bot_id,
        settings,
      } = req.body;

      // Validate required fields
      if (!sender_id || !text) {
        return res.status(400).json({
          success: false,
          message: 'sender_id and text are required',
        });
      }

      // Gửi tin nhắn
      const response = await vnSmartBotProvider.sendMessage({
        sender_id,
        text,
        input_channel,
        metadata,
        session_id,
        bot_id,
        settings,
      });

      // Parse card data
      const parsedData = vnSmartBotProvider.parseCardData(response);

      res.json({
        success: true,
        data: {
          raw: response,
          parsed: parsedData,
        },
      });
    } catch (error) {
      console.error('Error in conversation:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing conversation',
        error: error.message,
      });
    }
  }

  /**
   * Xử lý button click từ card_data
   * POST /api/smartbot/button-action
   */
  async handleButtonAction(req, res) {
    try {
      const {
        sender_id,
        button,
        session_id,
        bot_id,
      } = req.body;

      if (!sender_id || !button) {
        return res.status(400).json({
          success: false,
          message: 'sender_id and button are required',
        });
      }

      // Xử lý theo type của button
      let responseText = '';
      
      switch (button.type) {
        case 'postback':
          // Gửi payload về bot
          responseText = button.payload;
          break;
        
        case 'web_url':
          // Trả về URL để frontend redirect
          return res.json({
            success: true,
            action: 'redirect',
            url: button.payload,
          });
        
        case 'phone_number':
          // Trả về số điện thoại để frontend xử lý
          return res.json({
            success: true,
            action: 'call',
            phoneNumber: button.payload,
          });
        
        default:
          return res.status(400).json({
            success: false,
            message: 'Invalid button type',
          });
      }

      // Format metadata nếu button có button_variables
      let metadata = {};
      if (button.button_variables && button.button_variables.length > 0) {
        metadata = vnSmartBotProvider.formatMetadata(button.button_variables);
      }

      // Gửi payload về bot
      const response = await vnSmartBotProvider.sendMessage({
        sender_id,
        text: responseText,
        input_channel: 'platform',
        metadata,
        session_id,
        bot_id,
      });

      // Parse card data
      const parsedData = vnSmartBotProvider.parseCardData(response);

      res.json({
        success: true,
        data: {
          raw: response,
          parsed: parsedData,
        },
      });
    } catch (error) {
      console.error('Error in handleButtonAction:', error);
      res.status(500).json({
        success: false,
        message: 'Error handling button action',
        error: error.message,
      });
    }
  }

  /**
   * Gửi tin nhắn với metadata (biến)
   * POST /api/smartbot/conversation-with-variables
   */
  async conversationWithVariables(req, res) {
    try {
      const {
        sender_id,
        text,
        variables, // Array of {variableName, value}
        input_channel,
        session_id,
        bot_id,
        settings,
      } = req.body;

      if (!sender_id || !text) {
        return res.status(400).json({
          success: false,
          message: 'sender_id and text are required',
        });
      }

      // Format metadata
      const metadata = variables && variables.length > 0 
        ? vnSmartBotProvider.formatMetadata(variables)
        : {};

      // Gửi tin nhắn
      const response = await vnSmartBotProvider.sendMessage({
        sender_id,
        text,
        input_channel,
        metadata,
        session_id,
        bot_id,
        settings,
      });

      // Parse card data
      const parsedData = vnSmartBotProvider.parseCardData(response);

      res.json({
        success: true,
        data: {
          raw: response,
          parsed: parsedData,
        },
      });
    } catch (error) {
      console.error('Error in conversationWithVariables:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing conversation with variables',
        error: error.message,
      });
    }
  }

  /**
   * Test connection với vnSmartBot
   * GET /api/smartbot/health
   */
  async healthCheck(req, res) {
    try {
      // Gửi một tin nhắn đơn giản để test
      const response = await vnSmartBotProvider.sendMessage({
        sender_id: 'health_check',
        text: 'hi',
        input_channel: 'platform',
        session_id: `health_${Date.now()}`,
      });

      res.json({
        success: true,
        message: 'vnSmartBot connection is healthy',
        data: response,
      });
    } catch (error) {
      console.error('Error in healthCheck:', error);
      res.status(500).json({
        success: false,
        message: 'vnSmartBot connection failed',
        error: error.message,
      });
    }
  }
}

module.exports = new VnSmartBotController();
