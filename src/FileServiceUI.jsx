import React, { useState, useRef } from 'react';
import './CSS/fileServiceUI.css'; 

const FileServiceUI = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [toEmail, setToEmail] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const maxFiles = 10;
  
  // Hook to detect mobile screen size
  const [isMobile, setIsMobile] = useState(false);
  
  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    
    // Check if adding these files would exceed the limit
    const totalFiles = selectedFiles.length + fileArray.length;
    if (totalFiles > maxFiles) {
      showMessage(`Cannot add ${fileArray.length} files. Maximum ${maxFiles} files allowed. Currently have ${selectedFiles.length} files.`, 'error');
      return;
    }

    const newFiles = [...selectedFiles];
    fileArray.forEach(file => {
      // Check for duplicates
      const isDuplicate = newFiles.some(f => f.name === file.name && f.size === file.size);
      if (!isDuplicate) {
        newFiles.push(file);
      }
    });

    setSelectedFiles(newFiles);
    
    // Clear the input so the same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      setMessage({ text: '', type: '' });
    }, 5000);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedFiles.length === 0) {
      showMessage('Please select at least one file.', 'error');
      return;
    }

    if (!toEmail) {
      showMessage('Please enter recipient email address.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('toEmail', toEmail);
      
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      // Replace with your actual API endpoint
      const response = await fetch(`${backendUrl}/api/send`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (response.ok && result.message) {
        showMessage(result.message, 'success');
        // Reset form
        setSelectedFiles([]);
        setToEmail('');
      } else {
        showMessage('Error: ' + (result.message || 'Failed to send files'), 'error');
      }
    } catch (error) {
      showMessage('Network error: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      
      <div className="container">
        <div className="card">
          <h2 className="title">Send Files Securely</h2>
          
          {message.text && (
            <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
              {message.text}
            </div>
          )}

          <div>
            <div className="form-group">
              <label htmlFor="toEmail" className="label">
                Recipient Email Address
              </label>
              <input
                type="email"
                id="toEmail"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
                className="email-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="files" className="label">
                Select Files (Max 10 files)
              </label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  ref={fileInputRef}
                  id="files"
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                  className="file-input"
                />
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`file-display ${selectedFiles.length > 0 ? 'selected' : ''}`}
                >
                  <div className="file-icon">
                    {selectedFiles.length === 0 ? '📁' : '📎'}
                  </div>
                  <div className="file-text">
                    {selectedFiles.length === 0
                      ? 'Click to select files or drag and drop'
                      : `${selectedFiles.length} file(s) selected`
                    }
                  </div>
                  <div className="file-subtext">
                    {selectedFiles.length === 0
                      ? 'Maximum 10 files allowed'
                      : `Click to add more (${maxFiles - selectedFiles.length} remaining)`
                    }
                  </div>
                </div>
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{formatFileSize(file.size)}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="remove-file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedFiles.length === 0 || isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? 'Sending...' : 'Send Files'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FileServiceUI;