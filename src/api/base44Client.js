/**
 * base44Client.js - API Client for Base44 Backend
 * 
 * This module provides all API communication with the Base44 backend service.
 * It handles three main entity types:
 * - Pet: The user's mythical creature data
 * - Expense: Tracking of all pet-related costs
 * - Memorial: Records of deceased pets
 * 
 * DATA STORAGE:
 * - All data is persisted in Base44's cloud database
 * - Uses RESTful API patterns (GET, POST, PUT, DELETE)
 * - Returns arrays and objects as appropriate
 * 
 * SECURITY:
 * - API key authentication for all requests
 * - Content-Type headers for JSON communication
 * 
 * @module base44Client
 */

// Base44 API Configuration
const BASE_URL = 'https://app.base44.com/api/apps/69371adf08981643d535234e/entities';
const API_KEY = '0f2e5a0153f7484ba81dad39df386558';

/**
 * Generic API request handler
 * Wraps fetch with proper headers, error handling, and response parsing
 * 
 * @param {string} endpoint - API endpoint path (e.g., '/Pet', '/Pet/123')
 * @param {Object} options - Fetch options (method, body, etc.)
 * @returns {Promise<Object|Array>} Parsed JSON response
 * @throws {Error} If request fails or returns non-OK status
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'api_key': API_KEY,           // Authentication header
        'Content-Type': 'application/json', // JSON content type
        ...options.headers,           // Allow header overrides
      },
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    // Parse JSON response, handle empty responses
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

/**
 * Base44 API Client
 * Provides methods for CRUD operations on all entity types
 */
export const base44 = {
  entities: {
    /**
     * Pet Entity Operations
     * Handles all pet-related data operations
     */
    Pet: {
      /**
       * Get all pets for the current user
       * @returns {Promise<Array>} Array of pet objects
       */
      list: async () => {
        const result = await apiRequest('/Pet');
        // Normalize response to always return array
        return Array.isArray(result) ? result : (result ? [result] : []);
      },
      
      /**
       * Create a new pet
       * @param {Object} petData - Pet data including name, species, stats
       * @returns {Promise<Object>} Created pet object with ID
       */
      create: async (petData) => {
        return apiRequest('/Pet', {
          method: 'POST',
          body: JSON.stringify(petData),
        });
      },
      
      /**
       * Update an existing pet's data
       * @param {string} id - Pet's unique identifier
       * @param {Object} data - Fields to update
       * @returns {Promise<Object>} Updated pet object
       */
      update: async (id, data) => {
        return apiRequest(`/Pet/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },
      
      /**
       * Delete a pet permanently
       * @param {string} id - Pet's unique identifier
       * @returns {Promise<Object>} Deletion confirmation
       */
      delete: async (id) => {
        return apiRequest(`/Pet/${id}`, {
          method: 'DELETE',
        });
      },
    },
    
    /**
     * Expense Entity Operations
     * Tracks all pet care costs for reporting
     */
    Expense: {
      /**
       * Get all expenses
       * @returns {Promise<Array>} Array of expense objects
       */
      list: async () => {
        const result = await apiRequest('/Expense');
        return Array.isArray(result) ? result : (result ? [result] : []);
      },
      
      /**
       * Filter expenses by pet ID
       * @param {Object} params - Filter parameters
       * @param {string} params.pet_id - Pet's unique identifier
       * @returns {Promise<Array>} Filtered expense array
       */
      filter: async ({ pet_id }) => {
        const result = await apiRequest(`/Expense?pet_id=${pet_id}`);
        return Array.isArray(result) ? result : (result ? [result] : []);
      },
      
      /**
       * Create a new expense record
       * @param {Object} expenseData - Expense data (pet_id, type, amount, description)
       * @returns {Promise<Object>} Created expense object
       */
      create: async (expenseData) => {
        return apiRequest('/Expense', {
          method: 'POST',
          body: JSON.stringify(expenseData),
        });
      },
      
      /**
       * Delete an expense record
       * @param {string} id - Expense's unique identifier
       * @returns {Promise<Object>} Deletion confirmation
       */
      delete: async (id) => {
        return apiRequest(`/Expense/${id}`, {
          method: 'DELETE',
        });
      },
    },

    /**
     * Memorial Entity Operations
     * Preserves memories of deceased pets
     */
    Memorial: {
      /**
       * Get all memorials
       * @returns {Promise<Array>} Array of memorial objects
       */
      list: async () => {
        const result = await apiRequest('/Memorial');
        return Array.isArray(result) ? result : (result ? [result] : []);
      },

      /**
       * Create a new memorial for a deceased pet
       * @param {Object} memorialData - Memorial data (pet_name, epitaph, etc.)
       * @returns {Promise<Object>} Created memorial object
       */
      create: async (memorialData) => {
        return apiRequest('/Memorial', {
          method: 'POST',
          body: JSON.stringify(memorialData),
        });
      },

      /**
       * Update a memorial's data
       * @param {string} id - Memorial's unique identifier
       * @param {Object} data - Fields to update
       * @returns {Promise<Object>} Updated memorial object
       */
      update: async (id, data) => {
        return apiRequest(`/Memorial/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data),
        });
      },

      /**
       * Delete a memorial permanently
       * @param {string} id - Memorial's unique identifier
       * @returns {Promise<Object>} Deletion confirmation
       */
      delete: async (id) => {
        return apiRequest(`/Memorial/${id}`, {
          method: 'DELETE',
        });
      },
    },
  },
};

export default base44;

