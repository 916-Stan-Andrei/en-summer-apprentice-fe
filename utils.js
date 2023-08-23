/** 
 * @param {string} str
 * @returns {string}
 * */
export const kebebCase = (str) => str.replaceAll(' ', '-');
/**
 * @param {string} searchTerm
 */

// Initialize Toastr
toastr.options = {
    closeButton: true,
    progressBar: true,
    preventDuplicates: true,
    positionClass: 'toast-top-right', // Adjust the position as needed
    // More configuration options can be added here
  };