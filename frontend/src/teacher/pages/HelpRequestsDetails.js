import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HelpRequestsDetails() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [token, setToken] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [search, setSearch] = useState("");
  const chatEndRef = useRef(null);

  const BASE_URL = "https://ai-based-foundational-learning-production.up.railway.app";

  const getThreadId = (item) => item?.id || item?._id || null;

  useEffect(() => {
    const t =
      localStorage.getItem("teacher_token") ||
      localStorage.getItem("token");
    setToken(t);
  }, []);

  const normalizeMessages = (request) => {
    if (
      request?.messages &&
      Array.isArray(request.messages) &&
      request.messages.length > 0
    ) {
      return request.messages;
    }

    const msgs = [];

    if (request?.message) {
      msgs.push({
        sender: "student",
        text: request.message,
        image: null,
        timestamp: request.created_at || null,
      });
    }

    if (request?.reply) {
      msgs.push({
        sender: "teacher",
        text: request.reply,
        image: null,
        timestamp: request.updated_at || null,
      });
    }

    return msgs;
  };

  const sortByLatest = (items) => {
    return [...items].sort((a, b) => {
      const aTime = new Date(
        a.latest_time || a.updated_at || a.created_at || 0
      ).getTime();
      const bTime = new Date(
        b.latest_time || b.updated_at || b.created_at || 0
      ).getTime();
      return bTime - aTime;
    });
  };

  const groupChatsByStudent = (threads) => {
    const grouped = {};

    threads.forEach((thread) => {
      const studentKey =
        thread.student_id ||
        thread.user_id ||
        thread.student_email ||
        thread.student_name ||
        "unknown-student";

      const currentMessages = normalizeMessages(thread);

      if (!grouped[studentKey]) {
        grouped[studentKey] = {
          ...thread,
          groupedThreads: [thread],
          messages: [...currentMessages].sort(
            (a, b) =>
              new Date(a.timestamp || 0).getTime() -
              new Date(b.timestamp || 0).getTime()
          ),
          latest_time: thread.updated_at || thread.created_at,
          title: thread.title || thread.message || "New doubt",
        };
      } else {
        grouped[studentKey].groupedThreads.push(thread);

        grouped[studentKey].messages = [
          ...(grouped[studentKey].messages || []),
          ...currentMessages,
        ].sort(
          (a, b) =>
            new Date(a.timestamp || 0).getTime() -
            new Date(b.timestamp || 0).getTime()
        );

        const threadTime = new Date(
          thread.updated_at || thread.created_at || 0
        ).getTime();
        const savedTime = new Date(
          grouped[studentKey].latest_time || 0
        ).getTime();

        if (threadTime > savedTime) {
          grouped[studentKey].latest_time =
            thread.updated_at || thread.created_at;
          grouped[studentKey].title =
            thread.title || thread.message || "New doubt";
        }
      }
    });

    const finalGrouped = Object.values(grouped).map((chat) => {
      const sortedMessages = [...(chat.messages || [])].sort(
        (a, b) =>
          new Date(a.timestamp || 0).getTime() -
          new Date(b.timestamp || 0).getTime()
      );

      const lastMessage = sortedMessages[sortedMessages.length - 1];

      return {
        ...chat,
        messages: sortedMessages,
        status: lastMessage?.sender === "teacher" ? "answered" : "pending",
      };
    });

    return sortByLatest(finalGrouped);
  };

  const fetchHelpRequests = async (authToken) => {
    try {
      setLoadingThreads(true);

      const res = await axios.get(`${BASE_URL}/api/help/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const allThreads = sortByLatest(res.data?.all_doubts || []);
      setHelpRequests(allThreads);
    } catch (err) {
      console.error("Error fetching help requests:", err?.response?.data || err.message);
    } finally {
      setLoadingThreads(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchHelpRequests(token);
  }, [token]);

  const groupedRequests = useMemo(() => {
    return groupChatsByStudent(helpRequests);
  }, [helpRequests]);

  useEffect(() => {
    if (!selectedRequest && groupedRequests.length > 0) {
      setSelectedRequest(groupedRequests[0]);
      setThreadMessages(groupedRequests[0].messages || []);
    } else if (selectedRequest) {
      const studentKey =
        selectedRequest.student_id ||
        selectedRequest.user_id ||
        selectedRequest.student_email ||
        selectedRequest.student_name;

      const updatedSelected = groupedRequests.find((item) => {
        const itemKey =
          item.student_id ||
          item.user_id ||
          item.student_email ||
          item.student_name;
        return itemKey === studentKey;
      });

      if (updatedSelected) {
        setSelectedRequest(updatedSelected);
        setThreadMessages(updatedSelected.messages || []);
      }
    }
  }, [groupedRequests]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadMessages]);

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groupedRequests;

    return groupedRequests.filter((r) => {
      const studentName = (r.student_name || r.name || "").toLowerCase();
      const studentEmail = (r.student_email || "").toLowerCase();
      const title = (r.title || "").toLowerCase();
      const lastText =
        (r.messages?.[r.messages.length - 1]?.text || r.message || "").toLowerCase();

      return (
        studentName.includes(q) ||
        studentEmail.includes(q) ||
        title.includes(q) ||
        lastText.includes(q)
      );
    });
  }, [groupedRequests, search]);

  const openThread = (requestItem) => {
    setLoadingChat(true);
    setSelectedRequest(requestItem);
    setThreadMessages(requestItem.messages || []);
    setReply("");
    setSelectedImage(null);

    setTimeout(() => {
      setLoadingChat(false);
    }, 150);
  };

  const refreshSelectedThread = async (authToken) => {
    try {
      const allRes = await axios.get(`${BASE_URL}/api/help/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const allThreads = sortByLatest(allRes.data?.all_doubts || []);
      setHelpRequests(allThreads);
    } catch (err) {
      console.error("Error refreshing selected chat:", err?.response?.data || err.message);
    }
  };

  const sendReply = async () => {
    if (!selectedRequest || !token) return;

    const trimmedReply = reply.trim();
    if (!trimmedReply && !selectedImage) {
      alert("Please type a reply or attach an image");
      return;
    }

    try {
      setSending(true);

      const optimisticImage = selectedImage ? URL.createObjectURL(selectedImage) : null;

      const optimisticMessage = {
        sender: "teacher",
        text: trimmedReply,
        image: optimisticImage,
        timestamp: new Date().toISOString(),
      };

      setThreadMessages((prev) => [...prev, optimisticMessage]);

      const latestThread =
  selectedRequest.groupedThreads?.[selectedRequest.groupedThreads.length - 1] ||
  selectedRequest;

      const selectedId = getThreadId(latestThread);

      if (!selectedId) {
        throw new Error("No valid thread id found");
      }

      const formData = new FormData();
      formData.append("message", trimmedReply);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const messageRes = await fetch(`${BASE_URL}/api/help/message/${selectedId}`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const messageData = await messageRes.json();

if (!messageRes.ok) {
  console.error("Primary reply route failed:", messageData);

  if (selectedImage) {
    throw new Error(messageData?.error || "Failed to send image reply");
  }

  const fallbackRes = await fetch(`${BASE_URL}/api/help/reply/${selectedId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ reply: trimmedReply }),
  });

  const fallbackData = await fallbackRes.json();

  if (!fallbackRes.ok) {
    throw new Error(fallbackData?.error || "Failed to send reply");
  }
}
      setReply("");
      setSelectedImage(null);
      await refreshSelectedThread(token);
    } catch (err) {
      console.error("Error sending reply:", err?.response?.data || err.message);
      await refreshSelectedThread(token);
      alert(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send reply"
      );
    } finally {
      setSending(false);
    }
  };

  const formatTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  };

  const getPreviewText = (thread) => {
    if (thread?.messages?.length > 0) {
      return thread.messages[thread.messages.length - 1]?.text || "New doubt";
    }
    return thread?.title || thread?.message || "New doubt";
  };

  return (
    <div
      className="analytics-page"
      style={{
        height: "100vh",
        overflow: "visible",
        paddingTop: "10px",
        boxSizing: "border-box",
      }}
    >
      <div className="analytics-header">
        <div className="top-bar">
          <h1 className="dashboard-heading">📨 Help Requests</h1>
        </div>
        <Link to="/dashboard">
          <button className="back-btn">← Back</button>
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          gap: "20px",
          alignItems: "stretch",
          height: "100%",
          overflow: "visible",
        }}
      >
        <div
          style={{
            background: "#f8f4ea",
            borderRadius: "18px",
            padding: "16px",
            border: "1px solid #e5d8b8",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          <div style={{ marginBottom: "14px", flexShrink: 0 }}>
            <h3 style={{ margin: 0, fontSize: "22px", color: "#4a3b1f" }}>
              Student Chats
            </h3>
          </div>

          <input
            type="text"
            placeholder="Search student or doubt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "90%",
              padding: "12px 14px",
              borderRadius: "12px",
              border: "1px solid #d8c8a4",
              outline: "none",
              marginBottom: "14px",
              background: "#fffdf8",
              flexShrink: 0,
            }}
          />

          <div
            style={{
              overflowY: "auto",
              flex: 1,
              paddingRight: "4px",
              minHeight: 0,
            }}
          >
            {loadingThreads ? (
              <p style={{ color: "#7a6a4d" }}>Loading chats...</p>
            ) : filteredRequests.length === 0 ? (
              <p style={{ color: "#7a6a4d" }}>No chats found.</p>
            ) : (
              filteredRequests.map((r, index) => {
                const studentKey =
                  r.student_id ||
                  r.user_id ||
                  r.student_email ||
                  r.student_name;

                const selectedKey =
                  selectedRequest?.student_id ||
                  selectedRequest?.user_id ||
                  selectedRequest?.student_email ||
                  selectedRequest?.student_name;

                const isActive = studentKey === selectedKey;
                const previewText = getPreviewText(r);

                return (
                  <button
                    key={studentKey || index}
                    onClick={() => openThread(r)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      border: isActive ? "2px solid #e9b458" : "1px solid #e7dcc1",
                      background: isActive ? "#fff7e8" : "#ffffff",
                      borderRadius: "14px",
                      padding: "14px",
                      marginBottom: "10px",
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <strong
                          style={{
                            color: "#4a3b1f",
                            fontSize: "15px",
                            display: "block",
                            marginBottom: "3px",
                          }}
                        >
                          {r.student_name || r.name || "Unknown Student"}
                        </strong>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "#78684c",
                            wordBreak: "break-word",
                          }}
                        >
                          {r.student_email || ""}
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "999px",
                          background:
                            r.status === "answered" ? "#dff3df" : "#ffe6c7",
                          color:
                            r.status === "answered" ? "#2f7a37" : "#9a5b00",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.status === "answered" ? "Answered" : "Unanswered"}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#54462d",
                        marginBottom: "6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {previewText}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div
          style={{
            background: "#f8f4ea",
            borderRadius: "18px",
            border: "1px solid #e5d8b8",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {!selectedRequest ? (
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#7a6a4d",
                fontSize: "18px",
              }}
            >
              Select a student chat from the left sidebar
            </div>
          ) : (
            <>
              <div
                style={{
                  padding: "18px 22px",
                  borderBottom: "1px solid #e5d8b8",
                  background: "#fff9ef",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "14px",
                  flexShrink: 0,
                }}
              >
                <div>
                  <h3 style={{ margin: 0, color: "#4a3b1f" }}>
                    {selectedRequest.student_name || "Student"}
                  </h3>
                  <p style={{ margin: "5px 0 0", color: "#7a6a4d", fontSize: "14px" }}>
                    {selectedRequest.student_email || ""}
                  </p>
                </div>

                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background:
                      selectedRequest.status === "answered" ? "#dff3df" : "#ffe6c7",
                    color:
                      selectedRequest.status === "answered" ? "#2f7a37" : "#9a5b00",
                  }}
                >
                  {selectedRequest.status === "answered" ? "Answered" : "Unanswered"}
                </span>
              </div>

              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "20px",
                  background: "#fcfaf4",
                  minHeight: 0,
                }}
              >
                {loadingChat ? (
                  <p style={{ color: "#7a6a4d" }}>Loading conversation...</p>
                ) : threadMessages.length > 0 ? (
                  threadMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent:
                          msg.sender === "teacher" ? "flex-end" : "flex-start",
                        marginBottom: "14px",
                      }}
                    >
                      <div
                        style={{
                          maxWidth: "70%",
                          padding: "12px 14px",
                          borderRadius: "16px",
                          background:
                            msg.sender === "teacher" ? "#f2e1b9" : "#efe7d7",
                          color: "#4a3b1f",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "11px",
                            fontWeight: "bold",
                            marginBottom: "6px",
                            color: "#8b6b25",
                            textTransform: "uppercase",
                          }}
                        >
                          {msg.sender === "teacher" ? "Teacher" : "Student"}
                        </div>

                        {msg.text ? (
                          <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>
                        ) : null}

                        {msg.image ? (
                          <img
                            src={msg.image.startsWith("blob:") ? msg.image : `${BASE_URL}${msg.image}`}
                            alt="chat attachment"
                            style={{
                              maxWidth: "220px",
                              borderRadius: "10px",
                              marginTop: "8px",
                            }}
                          />
                        ) : null}

                        <div
                          style={{
                            marginTop: "8px",
                            fontSize: "11px",
                            color: "#8c7a5e",
                          }}
                        >
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#7a6a4d" }}>No messages found.</p>
                )}
                <div ref={chatEndRef}></div>
              </div>

              <div
                style={{
                  borderTop: "1px solid #e5d8b8",
                  background: "#fff9ef",
                  padding: "16px",
                  flexShrink: 0,
                }}
              >
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  style={{
                    width: "98%",
                    borderRadius: "14px",
                    border: "1px solid #d7c7a6",
                    padding: "14px",
                    outline: "none",
                    resize: "none",
                    background: "#fffdf8",
                    fontSize: "15px",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <label
                      style={{
                        background: "#fff",
                        color: "#4a3b1f",
                        border: "1px solid #d7c7a6",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Attach Image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                        style={{ display: "none" }}
                        onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                      />
                    </label>

                    {selectedImage ? (
                      <span style={{ color: "#7a6a4d", fontSize: "13px" }}>
                        {selectedImage.name}
                      </span>
                    ) : null}

                    <button
                      onClick={sendReply}
                      disabled={sending}
                      style={{
                        background: "#e9b458",
                        color: "#fff",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        fontWeight: "bold",
                        cursor: sending ? "not-allowed" : "pointer",
                        opacity: sending ? 0.7 : 1,
                      }}
                    >
                      {sending ? "Sending..." : "Send Reply"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRequest(null);
                        setThreadMessages([]);
                        setReply("");
                        setSelectedImage(null);
                      }}
                      style={{
                        background: "#d9c9a7",
                        color: "#4a3b1f",
                        border: "none",
                        borderRadius: "10px",
                        padding: "10px 16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Close Chat
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpRequestsDetails;