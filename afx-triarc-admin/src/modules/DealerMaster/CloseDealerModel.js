import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";

export class CloseDealerModel extends Component {
  render() {
    let { title, button1, button2, show, container, close } = this.props;
    return (
      <React.Fragment>
        <Modal
          className="close-modal mymodal"
          size="sm"
          show={show && show}
          onHide={() => {
            button2();
          }}
          style={{ width: "30%" }}>
          <Modal.Header closeButton>
            <Modal.Title className="w-70">{title} </Modal.Title>
          </Modal.Header>
          <Modal.Footer className="mt-5 pt-5 justify-content-center">
            <div className="footer-modal">
              <Button
                className="btn btn-success btn-lg mr-4"
                onClick={() => {
                  button1();
                  button2();
                }}>
                Yes
              </Button>

              <Button className="btn btn-danger btn-lg" onClick={button2}>
                No
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default CloseDealerModel;
