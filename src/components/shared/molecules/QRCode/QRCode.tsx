import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';
import { encrypt } from '@/lib/encryption';

interface QRCodeComponentProps {
  /** The worship ID to be encrypted in the QR code */
  worshipId: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Background color of the QR code */
  bgColor?: string;
  /** Foreground color of the QR code */
  fgColor?: string;
  /** CSS class name for styling */
  className?: string;
}

/**
 * QRCode component that generates encrypted QR codes with auto-refresh functionality
 * Updates the current datetime every 5 minutes to keep the QR code fresh
 */
const QRCodeComponent: React.FC<QRCodeComponentProps> = ({
  worshipId,
  size = 256,
  bgColor = '#FFFFFF',
  fgColor = '#000000',
  className = '',
}) => {
  const [encryptedData, setEncryptedData] = useState<string>('');

  /**
   * Generates current datetime in the format YYYYMMDDHHMM
   * @returns Formatted datetime string
   */
  const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}`;
  };

  /**
   * Encrypts the worship data with current datetime
   * @returns Encrypted string for QR code
   */
  const generateEncryptedData = (): string => {
    const currentDateTime = getCurrentDateTime();
    
    try {
      const encrypted = encrypt({
        worship_id: worshipId,
        current_datetime: currentDateTime,
      });
      
      return encrypted;
    } catch (error) {
      console.error('Failed to encrypt QR code data:', error);
      return '';
    }
  };

  /**
   * Updates the encrypted data with fresh datetime
   */
  const updateQRCode = () => {
    const newEncryptedData = generateEncryptedData();
    setEncryptedData(newEncryptedData);
  };

  // Initialize QR code data on component mount
  useEffect(() => {
    updateQRCode();
  }, [worshipId]);

  // Set up auto-refresh every 5 minutes (300,000 milliseconds)
  useEffect(() => {
    const interval = setInterval(() => {
      updateQRCode();
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [worshipId]);

  // Don't render if no encrypted data is available
  if (!encryptedData) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 rounded ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-500 text-sm">Loading QR Code...</span>
      </div>
    );
  }

  return (
    <div className={`inline-block ${className}`}>
      <QRCode
        value={encryptedData}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level="M"
      />
    </div>
  );
};

export default QRCodeComponent;