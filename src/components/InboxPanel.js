import React, { useEffect, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { toast } from "react-toastify";
import { apiRequest } from "../utils/api";

const InboxPanel = ({ role = "customer", initialVendorId = null, initialVendorName = "" }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    try {
      const data = await apiRequest("/api/messages", { role });
      let convs = data.conversations || [];

      // If opened from a product/shop "Send Message" button with a vendorId not yet in convs
      if (role === "customer" && initialVendorId) {
        const exists = convs.find((c) => Number(c.vendorId) === Number(initialVendorId));
        if (!exists) {
          const placeholder = {
            conversationId: `new-${initialVendorId}`,
            vendorId: Number(initialVendorId),
            vendorName: initialVendorName || `Vendor #${initialVendorId}`,
            messages: [],
          };
          convs = [placeholder, ...convs];
        }
        setActiveConvId(
          exists ? exists.conversationId : `new-${initialVendorId}`
        );
      } else if (convs.length > 0 && !activeConvId) {
        setActiveConvId(convs[0].conversationId);
      }

      setConversations(convs);
    } catch (error) {
      console.error("Failed to load messages:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, initialVendorId]);

  const activeConv = conversations.find((c) => c.conversationId === activeConvId) || conversations[0];

  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    setSending(true);
    try {
      await apiRequest("/api/messages", {
        method: "POST",
        role,
        body: {
          vendorId: activeConv.vendorId,
          customerId: activeConv.customerId,
          text: messageText.trim(),
        },
      });
      setMessageText("");
      await loadConversations();
    } catch (error) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-6 bg-white rounded shadow-sm">Loading messages...</div>;
  }

  return (
    <div className="w-full bg-white rounded-md shadow-sm border flex flex-col md:flex-row min-h-[60vh] overflow-hidden">
      {/* Conversations list */}
      <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r bg-gray-50">
        <div className="p-4 border-b font-semibold text-lg bg-white">
          {role === "vendor" ? "Customer Inquiries" : "My Messages"}
        </div>
        {conversations.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">
            No conversations yet.{" "}
            {role === "customer"
              ? "Click 'Send Message' on any product to contact its vendor."
              : "Customer inquiries will appear here."}
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.conversationId}
              onClick={() => setActiveConvId(conv.conversationId)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition ${
                activeConv?.conversationId === conv.conversationId ? "bg-blue-50 border-l-4 border-l-[#051d40]" : ""
              }`}
            >
              <div className="font-semibold text-gray-800">
                {role === "vendor" ? conv.customerName : conv.vendorName}
              </div>
              <div className="text-xs text-gray-500 truncate mt-1">
                {conv.messages?.length
                  ? conv.messages[conv.messages.length - 1].text
                  : "Start a conversation..."}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat thread */}
      <div className="w-full md:w-2/3 flex flex-col justify-between">
        {activeConv ? (
          <>
            <div className="p-4 border-b font-semibold text-gray-800 bg-white">
              Chat with {role === "vendor" ? activeConv.customerName : activeConv.vendorName}
            </div>
            <div className="p-4 flex-1 overflow-y-auto space-y-3 max-h-[45vh] bg-gray-50">
              {activeConv.messages.length === 0 ? (
                <div className="text-center text-gray-400 text-sm py-8">
                  Send your first message below.
                </div>
              ) : (
                activeConv.messages.map((m) => {
                  const isMine = m.senderRole === role;
                  return (
                    <div
                      key={m.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                          isMine
                            ? "bg-[#051d40] text-white"
                            : "bg-white border text-gray-800"
                        }`}
                      >
                        <p>{m.text}</p>
                        <span className="block text-[10px] opacity-70 mt-1">
                          {m.createdAt?.slice(0, 16)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <form onSubmit={handleSend} className="p-3 border-t bg-white flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#051d40]"
              />
              <button
                type="submit"
                disabled={sending}
                className="bg-[#051d40] text-white px-4 py-2 rounded-md flex items-center gap-1 hover:bg-[#0b2e63] disabled:opacity-60"
              >
                <AiOutlineSend size={18} />
                <span>Send</span>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 p-8">
            Select a conversation to view messages.
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxPanel;
