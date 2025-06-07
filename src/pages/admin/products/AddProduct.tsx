import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  Upload,
  Card,
  Row,
  Col,
  Typography,
  Button,
  Divider,
} from "antd";
import {
  InboxOutlined,
  BoldOutlined,
  ItalicOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  CodeOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { Image } from "lucide-react";
import "./Addproduct.scss";
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

interface ProductFormProps {}

const AddProduct: React.FC<ProductFormProps> = () => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".png,.jpg,.jpeg",
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info: any) {
      const { status } = info.file;
      if (status === "done") {
        console.log(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        console.log(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const formatText = (type: string) => {
    console.log(`Format ${type} applied`);
  };

  return (
    <div className="product-form-container">
      <Row gutter={24}>
        <Col span={16}>
          <Card className="main-card">
            <Title level={4} className="section-title">
              Thông tin cơ bản
            </Title>
            <Form form={form} layout="vertical">
              <Form.Item
                label={<span>Tên thú cưng</span>}
                name="productName"
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
              >
                <Input
                  placeholder="Product Name"
                  className="product-name-input"
                />
              </Form.Item>

              <Form.Item
                label={<span>{`Tuổi (tháng)`}</span>}
                name="productName"
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
              >
                <Input
                  placeholder="Product Name"
                  className="product-name-input"
                />
              </Form.Item>
              <Form.Item
                label={<span>Màu sắc</span>}
                name="productName"
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
              >
                <Input
                  placeholder="Product Name"
                  className="product-name-input"
                />
              </Form.Item>
              <Form.Item
                label={<span>Giới tính</span>}
                name="productName"
                rules={[
                  { required: true, message: "Product name is required" },
                ]}
              >
                <Input
                  placeholder="Product Name"
                  className="product-name-input"
                />
              </Form.Item>

              <div className="helper-text">
                A product name is required and recommended to be unique.
              </div>

              <Form.Item
                label="Description"
                name="description"
                className="description-section"
              >
                <div className="editor-container">
                  <div className="editor-toolbar">
                    <Select
                      defaultValue="paragraph"
                      className="format-select"
                      size="small"
                    >
                      <Option value="paragraph">Paragraph</Option>
                      <Option value="heading1">Heading 1</Option>
                      <Option value="heading2">Heading 2</Option>
                    </Select>

                    <div className="toolbar-buttons">
                      <Button
                        type="text"
                        size="small"
                        icon={<BoldOutlined />}
                        onClick={() => formatText("bold")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<ItalicOutlined />}
                        onClick={() => formatText("italic")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<StrikethroughOutlined />}
                        onClick={() => formatText("strikethrough")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<UnorderedListOutlined />}
                        onClick={() => formatText("unordered-list")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<OrderedListOutlined />}
                        onClick={() => formatText("ordered-list")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<LinkOutlined />}
                        onClick={() => formatText("link")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<CodeOutlined />}
                        onClick={() => formatText("code")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<UndoOutlined />}
                        onClick={() => formatText("undo")}
                      />
                      <Button
                        type="text"
                        size="small"
                        icon={<RedoOutlined />}
                        onClick={() => formatText("redo")}
                      />
                    </div>
                  </div>

                  <TextArea
                    placeholder="Type here..."
                    value={description}
                    onChange={handleDescriptionChange}
                    className="description-textarea"
                    rows={6}
                  />
                </div>
              </Form.Item>

              <div className="helper-text">
                Set a description to the product for better visibility.
              </div>

              <Divider />

              <Title level={4} className="section-title">
                Media
              </Title>

              <Dragger {...uploadProps} className="media-upload">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined
                    style={{ fontSize: "48px", color: "#1890ff" }}
                  />
                </p>
                <p className="ant-upload-text">
                  Drag 'n' drop some files here, or click to select files
                </p>
              </Dragger>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <div className="sidebar">
            <Card className="thumbnail-card">
              <Title level={5} className="card-title">
                Thumbnail
              </Title>
              <Dragger {...uploadProps} className="thumbnail-upload">
                <div className="upload-content">
                  <Image size={24} color="#1890ff" />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </Dragger>
              <div className="helper-text small">
                Set the product thumbnail image. Only *.png, *.jpg and *.jpeg
                image files are accepted.
              </div>
            </Card>

            <Card className="files-card">
              <Title level={5} className="card-title">
                Files
              </Title>
              <div className="files-placeholder">
                {/* Files content placeholder */}
              </div>
            </Card>

            <Card className="status-card">
              <div className="status-header">
                <Title level={5} className="card-title">
                  Status
                </Title>
                <div className="status-indicator active"></div>
              </div>
              <Select
                defaultValue="published"
                className="status-select"
                style={{ width: "100%" }}
              >
                <Option value="published">Published</Option>
                <Option value="draft">Draft</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
              <div className="helper-text small">Set the product status.</div>
            </Card>

            <Card className="details-card">
              <Title level={5} className="card-title">
                Product Details
              </Title>

              <div className="detail-section">
                <label className="detail-label">Categories</label>
                <Select
                  placeholder="Categories"
                  className="categories-select"
                  style={{ width: "100%" }}
                >
                  <Option value="category1">Category 1</Option>
                  <Option value="category2">Category 2</Option>
                </Select>
                <div className="helper-text small">
                  Add product to a category.
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AddProduct;
