import React, { useState } from "react";

import { Cross2Icon } from "@radix-ui/react-icons";

import CookieManager from "../../tools/CookieManager";
import { Form, Toast } from "radix-ui";

interface IProps {
  onSubmit: (data: { sourceDomain: string; targetDomain: string }) => void;
  initialValue?: { sourceDomain: string; targetDomain: string } | null;
}

const CookieTool: React.FC<IProps> = ({ onSubmit, initialValue }) => {
  const [sourceDomain, setSourceDomain] = useState(
    initialValue?.sourceDomain || ""
  );
  const [targetDomain, setTargetDomain] = useState(
    initialValue?.targetDomain || ""
  );
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToastMessage(message);
    setToastType(type);
    setOpen(true);
  };

  const handleTransferCookies = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!sourceDomain || !targetDomain) {
      showToast("请输入源域名和目标域名", "error");
      return;
    }

    setLoading(true);
    try {
      await CookieManager.transferCookies({
        sourceDomain,
        targetDomain,
      });
      showToast("Cookie设置成功！", "success");
      onSubmit({ sourceDomain, targetDomain });
    } catch (error) {
      showToast("Cookie转移失败，请查看控制台了解详情", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast.Provider swipeDirection="right">
        <Form.Root className="tool-container" onSubmit={handleTransferCookies}>
          <div className="tool-content space-y-4">
            <Form.Field name="sourceDomain">
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入获取cookie的域名（如：example.com,example2.com）"
                  value={sourceDomain}
                  onChange={(e) => setSourceDomain(e.target.value)}
                />
              </Form.Control>
              <Form.Message
                match="valueMissing"
                className="text-sm text-red-500 mt-1"
              >
                请输入源域名
              </Form.Message>
            </Form.Field>

            <Form.Field name="targetDomain">
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="输入设置cookie的域名（如：localhost:5173）"
                  value={targetDomain}
                  onChange={(e) => setTargetDomain(e.target.value)}
                />
              </Form.Control>
              <Form.Message
                match="valueMissing"
                className="text-sm text-red-500 mt-1"
              >
                请输入目标域名
              </Form.Message>
            </Form.Field>

            <Form.Submit asChild>
              <button
                type="submit"
                className="w-full text-xs mt-1.5 p-2 bg-[#233895] text-white border-none rounded cursor-pointer"
                disabled={loading}
              >
                设置Cookie
              </button>
            </Form.Submit>
          </div>
        </Form.Root>

        <Toast.Root
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-3 rounded shadow-md ${
            toastType === "success"
              ? "bg-[#f6ffed] border border-[#b7eb8f]"
              : "bg-[#fff2f0] border border-[#ffccc7]"
          }`}
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title
            className={
              toastType === "success" ? "text-[#52c41a]" : "text-[#ff4d4f]"
            }
          >
            {toastMessage}
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport />
      </Toast.Provider>
    </>
  );
};

export default CookieTool;
