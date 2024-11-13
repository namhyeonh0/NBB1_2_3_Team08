// src/components/Modal.js
import React from "react";

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{title}</h2>
                <button className="close-button" onClick={onClose}>닫기</button>
                <div className="modal-body">
                    {children}
                </div>
            </div>
            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    width: 300px;
                    max-height: 400px;
                    overflow-y: auto;
                    position: relative;
                }

                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 16px;
                    color: #555;
                }

                .modal-body {
                    margin-top: 20px;
                }
            `}</style>
        </div>
    );
};

export default Modal;
