import React, { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Icon from "@/components/shared/atoms/Icons/Icon";
import QRCodeComponent from "@/components/shared/molecules/QRCode";

/**
 * QR Code Page component that checks authentication status
 * Prompts user to login if not authenticated, otherwise shows QR functionality
 */
const QRcodePage: React.FC = () => {
  const { logined, user } = useAppSelector((state) => state.auth);
  
  // State to store QR code refresh key using timestamp
  const [qrCodeKey, setQrCodeKey] = useState<number>(Date.now());

  /**
   * Refresh QR code by updating the key with current timestamp
   */
  const refreshQRCode = () => {
    setQrCodeKey(Date.now());
  };

  // Set up auto-refresh every 5 minutes (300,000 milliseconds)
  useEffect(() => {
    const interval = setInterval(() => {
      refreshQRCode();
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  /**
   * Handle redirect to login page (member area)
   */
  const handleLoginRedirect = () => {
    // In a real app, this would use React Router or similar navigation
    // For now, we'll trigger a page reload to go back to login
    window.location.reload();
  };

  // If user is not logged in, show login prompt
  if (!logined) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="qrCode" width={32} iconColorClass="bg-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-gray-600">
              You need to be logged in to access the QR Code functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center text-sm text-gray-500 mb-4">
              Please log in to your member area to continue.
            </div>
            <Button
              onClick={handleLoginRedirect}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Go to Login (Member Area)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  /**
   * Get member ID from logged-in user's custom fields
   * Returns the worshipid from user data or a fallback value
   */
  const getMemberID = () => {
    return user?.custom_fields?.worshipid || "未設定";
  };

  // If user is logged in, show QR functionality
  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full shadow-lg bg-white">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            點名 QR Code
          </CardTitle>
          {/* <CardDescription className="text-gray-600">
            您的專屬會員識別碼
          </CardDescription> */}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* QR Code Area */}
          <div className="flex flex-col items-center space-y-4">
            {/* QR Code Display */}
            <div className="relative bg-white border-2 border-gray-200 rounded-lg p-4 shadow-sm">
              <QRCodeComponent 
                key={qrCodeKey}
                worshipId={getMemberID()}
                size={256}
                className="rounded"
              />
            </div>

            {/* Member ID Display */}
            <div className="text-center">
              <p className="text-lg font-medium text-gray-800">
                會員編號: {getMemberID()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg transition-colors"
              onClick={refreshQRCode}
            >
              重新整理
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRcodePage;
