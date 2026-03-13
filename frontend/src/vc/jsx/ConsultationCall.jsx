import React from "react";
import { useParams } from "react-router-dom";
import { JitsiMeeting } from "@jitsi/react-sdk";

function ConsultationCall() {

  const { roomId } = useParams();

  return (
    <div style={{
      height: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      background: "#f4f6f9"
    }}>

      {/* Top Header */}
      <div style={{
        height: "70px",
        background: "#0A1628",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 25px",
        fontWeight: "500"
      }}>

        <div style={{fontSize:"18px"}}>
          TeleHealth Consultation
        </div>

        <div>
          Room ID: {roomId}
        </div>

      </div>

      {/* Main Area */}
      <div style={{
        flex: 1,
        display: "flex"
      }}>

        {/* Video Section */}
        <div style={{
          flex: 3,
          background: "black"
        }}>

          <JitsiMeeting
            domain="meet.jit.si"
            roomName={`telehealth-${roomId}`}
            configOverwrite={{
              startWithAudioMuted: false,
              startWithVideoMuted: false,
            }}
            interfaceConfigOverwrite={{
              SHOW_JITSI_WATERMARK: false,
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "100%";
              iframeRef.style.width = "100%";
            }}
          />

        </div>

        {/* Patient Info Panel */}
        <div style={{
          flex: 1,
          background: "white",
          borderLeft: "1px solid #ddd",
          padding: "20px"
        }}>

          <h3>Patient Information</h3>

          <p><b>Name:</b> Demo Patient</p>
          <p><b>Age:</b> 34</p>
          <p><b>Blood Group:</b> O+</p>
          <p><b>Allergies:</b> None</p>

          <hr/>

          <h3>Consultation Notes</h3>

          <textarea
            placeholder="Doctor can write notes here..."
            style={{
              width: "100%",
              height: "200px",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc"
            }}
          />

          <button
            style={{
              marginTop: "15px",
              width: "100%",
              padding: "12px",
              background: "#14B8A6",
              border: "none",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Save Notes
          </button>

        </div>

      </div>

    </div>
  );
}

export default ConsultationCall;