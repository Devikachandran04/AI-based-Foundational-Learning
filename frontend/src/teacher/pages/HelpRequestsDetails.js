import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function HelpRequestsDetails() {
  const [helpRequests, setHelpRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [threadMessages, setThreadMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [token, setToken] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [search, setSearch] = useState("");
  const chatEndRef = useRef(null);

  const BASE_URL =
    "https://ai-based-foundational-learning-production.up.railway.app";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("/")) {
      return `${BASE_URL}${imagePath}`;
    }
    return `${BASE_URL}/${imagePath}`;
  };

  const getThreadId = (item) => item?.id || item?._id || null;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let t = urlParams.get("token");

    if (t) {
      localStorage.setItem("token", t);
      localStorage.setItem("teacher_token", t);
    } else {
      t = localStorage.getItem("teacher_token") || localStorage.getItem("token");
    }

    setToken(t);
  }, []);

  const normalizeMessages = useCallback((request) => {
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
        image: request.image || null,
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
  }, []);

  const sortByLatest = useCallback((items) => {
    return [...items].sort((a, b) => {
      const aTime = new Date(
        a.latest_time || a.updated_at || a.created_at || 0
      ).getTime();
      const bTime = new Date(
        b.latest_time || b.updated_at || b.created_at || 0
      ).getTime();
      return bTime - aTime;
    });
  }, []);

  const groupChatsByStudent = useCallback(
    (threads) => {
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
    },
    [normalizeMessages, sortByLatest]
  );

  const fetchHelpRequests = useCallback(
    async (authToken) => {
      try {
        setLoadingThreads(true);

        const res = await axios.get(`${BASE_URL}/api/help/all`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const allThreads = sortByLatest(res.data?.all_doubts || []);
        setHelpRequests(allThreads);
      } catch (err) {
        console.error(
          "Error fetching help requests:",
          err?.response?.data || err.message
        );
      } finally {
        setLoadingThreads(false);
      }
    },
    [sortByLatest]
  );

  useEffect(() => {
    if (!token) return;
    fetchHelpRequests(token);
  }, [token, fetchHelpRequests]);

  const groupedRequests = useMemo(() => {
    return groupChatsByStudent(helpRequests);
  }, [helpRequests, groupChatsByStudent]);

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
  }, [groupedRequests, selectedRequest]);

  useEffect(() => {
  if (threadMessages.length > 0) {
    chatEndRef.current?.scrollIntoView({ behavior: "auto" });
  }
}, [selectedRequest]);

  const filteredRequests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groupedRequests;

    return groupedRequests.filter((r) => {
      const studentName = (r.student_name || r.name || "").toLowerCase();
      const studentEmail = (r.student_email || "").toLowerCase();
      const title = (r.title || "").toLowerCase();
      const lastText = (
        r.messages?.[r.messages.length - 1]?.text ||
        r.message ||
        ""
      ).toLowerCase();

      return (
        studentName.includes(q) ||
        studentEmail.includes(q) ||
        title.includes(q) ||
        lastText.includes(q)
      );
    });
  }, [groupedRequests, search]);

  const totalChats = groupedRequests.length;
  const pendingChats = groupedRequests.filter(
    (r) => r.status !== "answered"
  ).length;
  const resolvedChats = groupedRequests.filter(
    (r) => r.status === "answered"
  ).length;

  const openThread = useCallback((requestItem) => {
    setLoadingChat(true);
    setSelectedRequest(requestItem);
    setThreadMessages(requestItem.messages || []);
    setReply("");
    setSelectedImage(null);

    setTimeout(() => {
      setLoadingChat(false);
    }, 120);
  }, []);

  const refreshSelectedThread = useCallback(
    async (authToken) => {
      try {
        const allRes = await axios.get(`${BASE_URL}/api/help/all`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        const allThreads = sortByLatest(allRes.data?.all_doubts || []);
        setHelpRequests(allThreads);
      } catch (err) {
        console.error(
          "Error refreshing selected chat:",
          err?.response?.data || err.message
        );
      }
    },
    [sortByLatest]
  );

  const sendReply = async () => {
    if (!selectedRequest || !token) return;

    const trimmedReply = reply.trim();
    if (!trimmedReply && !selectedImage) {
      alert("Please type a reply or attach an image");
      return;
    }

    try {
      setSending(true);

      const optimisticImage = selectedImage
        ? URL.createObjectURL(selectedImage)
        : null;

      const optimisticMessage = {
        sender: "teacher",
        text: trimmedReply,
        image: optimisticImage,
        timestamp: new Date().toISOString(),
      };

      setThreadMessages((prev) => [...prev, optimisticMessage]);

      const latestThread =
        selectedRequest.groupedThreads?.[
          selectedRequest.groupedThreads.length - 1
        ] || selectedRequest;

      const selectedId = getThreadId(latestThread);

      if (!selectedId) {
        throw new Error("No valid thread id found");
      }

      const formData = new FormData();
      formData.append("message", trimmedReply);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const messageRes = await fetch(
        `${BASE_URL}/api/help/message/${selectedId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const messageData = await messageRes.json();

      if (!messageRes.ok) {
        if (selectedImage) {
          throw new Error(messageData?.error || "Failed to send image reply");
        }

        const fallbackRes = await fetch(
          `${BASE_URL}/api/help/reply/${selectedId}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ reply: trimmedReply }),
          }
        );

        const fallbackData = await fallbackRes.json();

        if (!fallbackRes.ok) {
          throw new Error(fallbackData?.error || "Failed to send reply");
        }
      }

      setReply("");
      setSelectedImage(null);
      await refreshSelectedThread(token);
    } catch (err) {
      console.error(
        "Error sending reply:",
        err?.response?.data || err.message
      );
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

  const formatListTime = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getPreviewText = (thread) => {
    if (thread?.messages?.length > 0) {
      return thread.messages[thread.messages.length - 1]?.text || "New doubt";
    }
    return thread?.title || thread?.message || "New doubt";
  };

  const getLastMessageTime = (thread) => {
    if (thread?.messages?.length > 0) {
      return (
        thread.messages[thread.messages.length - 1]?.timestamp ||
        thread.latest_time ||
        thread.updated_at ||
        thread.created_at
      );
    }
    return thread.latest_time || thread.updated_at || thread.created_at;
  };

  return (
    <div className="analytics-page">
      <div className="top-navbar">
        <div className="logo-section">
          <h2 className="logo-text">GrammarPal</h2>
          <p className="logo-subtitle">Admin Panel</p>
        </div>

        <Link to="/dashboard">
          <button className="back-btn">Back</button>
        </Link>
      </div>

      <div className="top-bar">
        <div>
          <h1 className="dashboard-heading">Help Requests</h1>
          <p className="dashboard-subheading">
            Read student doubts, continue threads, and send replies with image support.
          </p>
        </div>
      </div>

      <div className="quick-nav">
        <Link to="/dashboard" className="quick-link">Overview</Link>
        <Link to="/progress" className="quick-link">Student Insights</Link>
        <Link to="/weak-topics" className="quick-link">Lesson Analytics</Link>
        <Link to="/low-scores" className="quick-link">Support Cases</Link>
        <Link to="/help-requests" className="quick-link active">Help Requests</Link>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <h4>Total Chats</h4>
          <p>{totalChats}</p>
        </div>

        <div className="kpi-card lowest-card">
          <h4>Pending Replies</h4>
          <p>{pendingChats}</p>
        </div>

        <div className="kpi-card highest-card">
          <h4>Resolved Chats</h4>
          <p>{resolvedChats}</p>
        </div>
      </div>

      <div className="help-layout">
        <div className="help-sidebar">
          <h3>Student Chats</h3>

          <input
            type="text"
            className="help-search"
            placeholder="Search student or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="help-list">
            {loadingThreads ? (
              <p className="loading-text">Loading chats...</p>
            ) : filteredRequests.length === 0 ? (
              <p className="loading-text">No chats found.</p>
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
                const lastTime = getLastMessageTime(r);

                return (
                  <button
                    key={studentKey || index}
                    onClick={() => openThread(r)}
                    className={`help-thread-card ${isActive ? "active" : ""}`}
                  >
                    <div className="help-thread-top">
                      <div>
                        <strong className="help-thread-name">
                          {r.student_name || r.name || "Unknown Student"}
                        </strong>
                        <div className="help-thread-email">
                          {r.student_email || ""}
                        </div>
                      </div>

                      <span
                        className={`help-thread-status ${
                          r.status === "answered" ? "answered" : "pending"
                        }`}
                      >
                        {r.status === "answered" ? "Answered" : "Pending"}
                      </span>
                    </div>

                    <div className="help-thread-preview">{previewText}</div>
                    <div className="help-thread-time">{formatListTime(lastTime)}</div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="help-chat-panel">
          {!selectedRequest ? (
            <div className="help-chat-messages">
              <p className="loading-text">Select a student chat from the left sidebar.</p>
            </div>
          ) : (
            <>
              <div className="help-chat-header">
                <div>
                  <h3 className="help-chat-title">
                    {selectedRequest.student_name || "Student"}
                  </h3>
                  <p className="help-chat-subtitle">
                    {selectedRequest.student_email || ""}
                  </p>
                </div>

                <span
                  className={`help-chat-status ${
                    selectedRequest.status === "answered" ? "answered" : "pending"
                  }`}
                >
                  {selectedRequest.status === "answered" ? "Answered" : "Pending"}
                </span>
              </div>

              <div className="help-chat-messages">
                {loadingChat ? (
                  <p className="loading-text">Loading conversation...</p>
                ) : threadMessages.length > 0 ? (
                  threadMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`help-message-row ${
                        msg.sender === "teacher" ? "teacher" : "student"
                      }`}
                    >
                      <div
                        className={`help-bubble ${
                          msg.sender === "teacher" ? "teacher" : "student"
                        }`}
                      >
                        <div className="help-sender">
                          {msg.sender === "teacher" ? "Admin" : "Student"}
                        </div>

                        {msg.text ? <div className="help-prewrap">{msg.text}</div> : null}

                        {msg.image ? (
                          <img
                            src={getImageUrl(msg.image)}
                            alt="chat attachment"
                            className="help-chat-image"
                            onClick={() => setPreviewImage(getImageUrl(msg.image))}
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : null}

                        <div className="help-bubble-time">
                          {formatTime(msg.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="loading-text">No messages found.</p>
                )}
                <div ref={chatEndRef}></div>
              </div>

              <div className="help-chat-input">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  className="help-textarea"
                />

                <div className="help-action-row">
                  <div className="help-button-group">
                    <label className="help-upload-label">
                      Attach Image
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                        style={{ display: "none" }}
                        onChange={(e) =>
                          setSelectedImage(e.target.files?.[0] || null)
                        }
                      />
                    </label>

                    <button
                      onClick={sendReply}
                      disabled={sending}
                      className="help-primary-btn"
                    >
                      {sending ? "Sending..." : "Send Reply"}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedRequest(null);
                        setThreadMessages([]);
                        setReply("");
                        setSelectedImage(null);
                        setPreviewImage(null);
                      }}
                      className="help-secondary-btn"
                    >
                      Close Chat
                    </button>
                  </div>

                  {selectedImage ? (
                    <span className="help-upload-name">{selectedImage.name}</span>
                  ) : null}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {previewImage ? (
        <div className="preview-overlay" onClick={() => setPreviewImage(null)}>
          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}
    </div>
  );
}

export default HelpRequestsDetails;