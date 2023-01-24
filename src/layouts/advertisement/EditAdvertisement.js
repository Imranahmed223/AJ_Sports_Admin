import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "examples/Footer";
import { Formik, Form } from "formik";
import FormInput from "components/FormInput/FormInput";
import MDButton from "components/MDButton";
import * as Yup from "yup";
import "./Table.css";
import {
  GetAdvById,
  UpdateAdv,
  clearErrors,
  clearMessages,
} from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function EditAdvertisement() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [image, setImage] = useState("");
  const imageInputRef = React.useRef();
  const updateValidation = Yup.object({
    type: Yup.string(),
    text: Yup.string(),
    link: Yup.string().url(),
    priority: Yup.string(),
  });
  const dispatch = useDispatch();
  const { singleAdv, errors, message, loading } = useSelector(
    (state) => state.advReducer
  );
  useEffect(() => {
    dispatch(GetAdvById(id));
  }, []);

  useEffect(() => {
    if (errors.length > 0) {
      toast.error(errors);
      dispatch(clearErrors());
    }
    if (message != "") {
      toast.success(message);
      dispatch(clearMessages());
      setTimeout(() => navigate("/advertisement"), 2000);
    }
  }, [errors, message]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <br />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Edit Advertisement
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <Formik
            initialValues={{
              type: singleAdv ? singleAdv.type : "",
              text: singleAdv ? singleAdv.text : "",
              link: singleAdv ? singleAdv.link : "",
              priority: singleAdv ? singleAdv.priority : "",
            }}
            validationSchema={updateValidation}
            onSubmit={(values, { resetForm }) => {
              const { type, text, link, priority } = values;
              if (image === "") {
                dispatch(UpdateAdv(id, values));
                resetForm();
              } else {
                const result = new FormData();
                result.append("type", type);
                result.append("text", text);
                result.append("link", link);
                result.append("priority", priority);
                result.append("photoPath", image);
                dispatch(UpdateAdv(id, result));
                resetForm();
              }
            }}
            enableReinitialize
          >
            {(formik) => (
              <Form>
                <FormInput label="Advertisement Type" name="type" type="text" />
                <FormInput label="Text" name="text" type="text" />
                <FormInput label="Link" name="link" type="text" />
                <FormInput label="Priority" name="priority" type="text" />
                <img
                  crossOrigin="true"
                  src={
                    singleAdv
                      ? singleAdv.photoPath
                      : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fcdn.pixabay.com%2Fphoto%2F2019%2F03%2F28%2F22%2F23%2Flink-4088190_1280.png&imgrefurl=https%3A%2F%2Fpixabay.com%2Fvectors%2Flink-hyperlink-external-link-chain-4088190%2F&tbnid=b0JKnhSDPuwOsM&vet=12ahUKEwjLv_voy-37AhW6gc4BHQzkCYoQMygDegUIARDEAQ..i&docid=pg0fPHRTbpqi-M&w=1280&h=1280&q=link%20of%20image&ved=2ahUKEwjLv_voy-37AhW6gc4BHQzkCYoQMygDegUIARDEAQ"
                  }
                  height="30"
                  width="30"
                  style={{ borderRadius: "50%", marginRight: "1rem" }}
                  alt="image"
                />
                <input
                  ref={imageInputRef}
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
                <center style={{ marginTop: "1rem" }}>
                  <MDButton
                    type="submit"
                    variant="gradient"
                    color="info"
                    fullWidth
                  >
                    {loading ? "Updating..." : "Update"}
                  </MDButton>
                </center>
              </Form>
            )}
          </Formik>
        </MDBox>
      </Card>
      <Footer />
    </DashboardLayout>
  );
}

export default EditAdvertisement;
