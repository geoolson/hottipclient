import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const url = "http://localhost:8080/"
const Menu = props => {
    return (
        <Modal
            {...props}
            centered
            style={{ zIndex: "1600" }}
        >
            <Modal.Header>
                <Modal.Title>Add Tip</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label className="d-block" for="tip">Tip Amount</label>
                <input type="text" className="w-100" id="tip" required />
                <label className="d-block" for="subtotal">Sub total</label>
                <input type="text" className="w-100" id="subtotal" required />
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={props.onHide}>
                    Cancel
                </button>
                <button className="btn btn-primary" onClick={() => {
                    const tip = document.getElementById("tip").value || "";
                    const subtotal = document.getElementById("subtotal").value || "";
                    const { lat, lng } = props.geoposition;
                    console.log(props);
                    fetch(`${url}api/addtip/${lat}/${lng}/${tip}/${subtotal}`,
                    {
                        method: "post"
                    })
                        .then(resp => resp.json())
                        .then(data => {
                            props.onHide();
                            console.log(data)
                        }
                        );
                }}>
                    Submit
                </button>
            </Modal.Footer>
        </Modal>
    );
}

export default Menu;