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
import "./AddPet.scss";
const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

interface ProductFormProps {}

const AddPet: React.FC<ProductFormProps> = () => {
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

              {/* <div className="helper-text">
                A product name is required and recommended to be unique.
              </div> */}

              <Divider />

              <Title level={4} className="section-title">
                Hình ảnh và mô tả
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

              <Form.Item
                label="Mô tả chi tiết"
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
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <div className="sidebar">
            <Card className="thumbnail-card">
              <Title level={5} className="card-title">
                Thông tin sức khỏe
              </Title>
              <Form form={form} layout="vertical">
                <Form.Item
                  label={<span>Tình trạng sức khỏe</span>}
                  name="productName"
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input
                    placeholder="eg: Khỏe mạnh, Đã tiêm vac xin"
                    className="product-name-input"
                  />
                </Form.Item>

                <Form.Item
                  label={<span>Trạng thái tiêm phòng</span>}
                  name="productName"
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input
                    placeholder="eg: Đã tiêm 2 mũi, chưa tiêm"
                    className="product-name-input"
                  />
                </Form.Item>
                <Form.Item
                  label={<span>Thông tin chứng nhận</span>}
                  name="productName"
                  rules={[
                    { required: true, message: "Product name is required" },
                  ]}
                >
                  <Input placeholder="eg: VCK" className="product-name-input" />
                </Form.Item>
              </Form>
            </Card>

            <Card className="files-card">
              <Form form={form} layout="vertical">
                <Title level={4}> Thông tin bán hàng</Title>
                <Form.Item
                  label={<span>Giá bán</span>}
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
                  label={<span>Số lượng</span>}
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
                {/* <Form.Item
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
                </Form.Item> */}
              </Form>
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
                <Option value="published">Đang bán</Option>
                <Option value="draft">Sắp có</Option>
                <Option value="inactive">Không bán</Option>
              </Select>
              <div className="helper-text small">Set the pet status.</div>
            </Card>

            <Card className="details-card">
              <Title level={5} className="card-title">
                Giống loài
              </Title>

              <div className="detail-section">
                <label className="detail-label">Danh mục</label>
                <Select
                  placeholder="Categories"
                  className="categories-select"
                  style={{ width: "100%" }}
                >
                  <Option value="category1">Category 1</Option>
                  <Option value="category2">Category 2</Option>
                  <Option value="category1">Category 1</Option>
                  <Option value="category2">Category 2</Option>
                  <Option value="category1">Category 1</Option>
                  <Option value="category2">Category 2</Option>
                  <Option value="category1">Category 1</Option>
                  <Option value="category2">Category 2</Option>
                  <Option value="category1">Category 1</Option>
                  <Option value="category2">Category 2</Option>
                </Select>
                <div className="helper-text small">Add pet to a category.</div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>

      <Row gutter={24} className="actions-btn">
        <Col>
          <Button type="primary">Thêm thú cưng</Button>
        </Col>
        <Col>
          <Button type="default">Hủy bỏ</Button>
        </Col>
      </Row>
    </div>
  );
};

export default AddPet;
