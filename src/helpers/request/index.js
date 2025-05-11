import axios from "axios";
import { toast } from "vue3-toastify";

class AppRequest {
  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      timeout: 10000,
      headers: {
        "Access-Control-Allow-Origin": "*",
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor
    this.instance.interceptors.request.use(
      (config) => {
        // Get token from localStorage
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  handleError(error) {
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response;
      
      // Handle validation errors (422)
      if (status === 422 && data.errors) {
        Object.values(data.errors).forEach((errorMessages) => {
          errorMessages.forEach((message) => {
            toast.error(message);
          });
        });
        return;
      }

      // Handle backend error message if available
      if (data.message) {
        toast.error(data.message);
        return;
      }

      // Fallback to status-based messages
      switch (status) {
        case 401:
          toast.error("Unauthorized access. Please login again.");
          // Optionally redirect to login page
          // router.push('/login')
          break;
        case 403:
          toast.error("You do not have permission to perform this action.");
          break;
        case 404:
          toast.error("The requested resource was not found.");
          break;
        case 500:
          toast.error("Internal server error. Please try again later.");
          break;
        default:
          toast.error("An error occurred. Please try again.");
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error("No response from server. Please check your internet connection.");
    } else {
      // Error in request configuration
      toast.error("An error occurred while setting up the request.");
    }
  }

  // HTTP Methods
  async get(url, params = {}) {
    return this.instance.get(url, { params });
  }

  async post(url, data = {}) {
    return this.instance.post(url, data);
  }

  async put(url, data = {}) {
    return this.instance.put(url, data);
  }

  async delete(url) {
    return this.instance.delete(url);
  }

  async patch(url, data = {}) {
    return this.instance.patch(url, data);
  }
}

// Create and export a single instance
const appRequest = new AppRequest();
export default appRequest;
