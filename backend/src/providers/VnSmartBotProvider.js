const axios = require('axios');
const config = require('../config');

/**
 * Provider để tương tác với vnSmartBot API
 * Hỗ trợ streaming responses và xử lý các loại card_data khác nhau
 */
class VnSmartBotProvider {
  constructor() {
    this.baseUrl = config.vnSmartBot.apiUrl;
    this.authorization = config.vnSmartBot.authorization;
    this.tokenId = config.vnSmartBot.tokenId;
    this.tokenKey = config.vnSmartBot.tokenKey;
    this.defaultBotId = config.vnSmartBot.botId;
  }

  /**
   * Gửi tin nhắn đến bot và nhận phản hồi streaming
   * @param {Object} params - Tham số gửi đến bot
   * @param {string} params.sender_id - ID của người dùng
   * @param {string} params.text - Nội dung tin nhắn
   * @param {string} params.input_channel - Kênh tương tác (mặc định: 'platform')
   * @param {Object} params.metadata - Metadata bổ sung (biến, session info)
   * @param {string} params.session_id - ID phiên làm việc
   * @param {string} params.bot_id - ID của bot (tùy chọn, dùng default nếu không có)
   * @param {Object} params.settings - Cài đặt prompt (system_prompt, advance_prompt)
   * @param {Function} onData - Callback function xử lý từng chunk data
   * @param {Function} onEnd - Callback function khi stream kết thúc
   * @param {Function} onError - Callback function khi có lỗi
   */
  async sendMessageStreaming(params, onData, onEnd, onError) {
    const {
      sender_id,
      text,
      input_channel = 'platform',
      metadata = {},
      session_id,
      bot_id,
      settings = {},
    } = params;

    const requestBody = {
      bot_id: bot_id || this.defaultBotId,
      sender_id,
      text,
      input_channel,
      metadata,
      session_id,
      settings,
    };

    try {
      const response = await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          'Authorization': this.authorization,
          'Token-id': this.tokenId,
          'Token-key': this.tokenKey,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
        data: requestBody,
        responseType: 'stream',
      });

      // Xử lý streaming data
      response.data.on('data', (chunk) => {
        try {
          const chunkStr = chunk.toString();
          // Parse SSE format (data: {...})
          const lines = chunkStr.split('\n');
          
          lines.forEach(line => {
            if (line.startsWith('data: ')) {
              const jsonStr = line.substring(6);
              if (jsonStr.trim()) {
                const data = JSON.parse(jsonStr);
                onData(data);
              }
            }
          });
        } catch (err) {
          console.error('Error parsing chunk:', err);
        }
      });

      response.data.on('end', () => {
        onEnd();
      });

      response.data.on('error', (err) => {
        onError(err);
      });

    } catch (error) {
      onError(error);
    }
  }

  /**
   * Gửi tin nhắn đến bot và nhận phản hồi không streaming (standard response)
   * @param {Object} params - Tham số gửi đến bot
   * @returns {Promise<Object>} - Response từ bot
   */
  async sendMessage(params) {
    const {
      sender_id,
      text,
      input_channel = 'platform',
      metadata = {},
      session_id,
      bot_id,
      settings = {},
    } = params;

    const requestBody = {
      bot_id: bot_id || this.defaultBotId,
      sender_id,
      text,
      input_channel,
      metadata,
      session_id,
      settings,
    };

    console.log(`🤖 [vnSmartBot] Calling API with text length: ${text?.length || 0}`);

    try {
      const response = await axios({
        method: 'POST',
        url: this.baseUrl,
        headers: {
          'Authorization': this.authorization,
          'Token-id': this.tokenId,
          'Token-key': this.tokenKey,
          'Content-Type': 'application/json',
        },
        data: requestBody,
      });

      console.log(`✅ [vnSmartBot] Response received, status: ${response.status}`);
      console.log(`📝 [vnSmartBot] Response structure:`, JSON.stringify(response.data).substring(0, 200));

      return response.data;
    } catch (error) {
      console.error(`❌ [vnSmartBot] API Error:`, error.message);
      if (error.response) {
        console.error(`❌ [vnSmartBot] Error response:`, error.response.status, error.response.data);
      }
      throw this._handleError(error);
    }
  }

  /**
   * Format metadata với button_variables
   * @param {Array} variables - Array của {variableName, value}
   * @returns {Object} - Metadata object
   */
  formatMetadata(variables = []) {
    if (!variables || variables.length === 0) {
      return {};
    }

    return {
      button_variables: variables.map(v => ({
        variableName: v.variableName,
        value: String(v.value), // Đảm bảo value là string
      })),
    };
  }

  /**
   * Parse card_data từ response
   * @param {Object} response - Response từ bot
   * @returns {Object} - Parsed card data với thông tin chi tiết
   */
  parseCardData(response) {
    if (!response?.object?.sb?.card_data) {
      return null;
    }

    const cardData = response.object.sb.card_data;
    const cardDataInfo = response.object.sb.card_data_info || {};
    const intentName = response.object.sb.intent_name;

    // Kiểm tra xem có phải là chuyển giao dịch viên không
    const hasTransferAgent = cardData.some(card => card.type === 'chuyen_gdv');

    return {
      cards: cardData,
      info: cardDataInfo,
      intentName,
      hasTransferAgent,
      textId: response.object.sb.text_id,
    };
  }

  /**
   * Kiểm tra xem response có phải là streaming hay không
   * @param {Object} cardDataInfo - Card data info từ response
   * @returns {boolean}
   */
  isStreaming(cardDataInfo) {
    // status = 0: Bản tin cuối (không streaming)
    // status = 1: Đang streaming
    // status = 2: Bản tin cuối (có streaming)
    return cardDataInfo?.status === 1 || cardDataInfo?.status === 2;
  }

  /**
   * Xử lý lỗi từ API
   * @private
   */
  _handleError(error) {
    if (error.response) {
      // API trả về error response
      return {
        success: false,
        message: error.response.data?.message || 'vnSmartBot API Error',
        statusCode: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      return {
        success: false,
        message: 'No response from vnSmartBot API',
        error: error.message,
      };
    } else {
      // Lỗi khác
      return {
        success: false,
        message: 'Error setting up request to vnSmartBot',
        error: error.message,
      };
    }
  }
}

module.exports = new VnSmartBotProvider();
