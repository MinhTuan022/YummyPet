import React, { useState, useEffect } from "react";
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
  InputNumber,
  message,
  UploadFile,
  Switch,
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
  LoadingOutlined,
} from "@ant-design/icons";
import "./AddPet.scss";
import { _request } from "../../../network/Api";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;

interface Category {
  id: number;
  name: string;
  description: string;
  parentId: any;
  parentName: any;
  categoryType: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: any;
}

interface AddPetFormData {
  name: string;
  categoryId: number;
  species: string;
  breed: string;
  gender: "male" | "female" | "other";
  ageMonths: number;
  weight: number;
  color: string;
  price: number;
  description?: string;
  arrivalDate: string;
  status: "available" | "sold";
  certificateInfo?: string;
  healthStatus: "excellent" | "good" | "fair" | "poor";
  vaccinationStatus: "fully_vaccinated" | "partially_vaccinated" | "not_vaccinated";
  isActive: boolean;
  primaryImageUrl?: string;
  images?: Array<{
    imageUrl: string;
    altText?: string;
    isPrimary?: boolean;
    displayOrder?: number;
  }>;
}

const AddPet: React.FC = () => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState("");  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [primaryImageIndex, setPrimaryImageIndex] = useState<number>(0);

  useEffect(() => {
    fetchCategories();
  }, []);
  const fetchCategories = () => {
    _request({
      path: "/categories/all",
      method: "GET",
      onSuccess(response) {
        if (response.success && response.data) {
          const petCategories = response.data.filter((cat: Category) => cat.categoryType === 'pet');
          setCategories(petCategories);
        }
      },
      onError(error) {
        console.log("Failed to fetch categories:", error);
        message.error("Failed to load categories");
      },
    });  };
  const uploadProps = {
    name: "file",
    multiple: true, 
    accept: ".png,.jpg,.jpeg",
    fileList,
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }
      return true;
    },
    customRequest: async ({ file, onSuccess, onError }: any) => {
      try {
        const objectUrl = URL.createObjectURL(file);
        
        setImageUrls(prev => [...prev, objectUrl]);
        
        onSuccess({ url: objectUrl });
        message.success(`${file.name} processed successfully`);
      } catch (error) {
        onError(error);
        message.error(`${file.name} processing failed`);
      }
    },
    onChange({ fileList: newFileList }: { fileList: UploadFile[] }) {
      setFileList(newFileList);
      
      if (newFileList.length < imageUrls.length) {
        const validUrls = newFileList
          .map(file => file.response?.url)
          .filter(Boolean);
        setImageUrls(validUrls);
      }
    },
    onRemove: (file: UploadFile) => {
      if (file.response?.url) {
        setImageUrls(prev => prev.filter(url => url !== file.response.url));
      }
    },
    onDrop(e: React.DragEvent) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
    form.setFieldsValue({ description: e.target.value });
  };

  const formatText = (type: string) => {
    console.log(`Format ${type} applied`);
  };  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const images = imageUrls.map((url, index) => ({
        imageUrl: url,
        altText: `${values.name} - Image ${index + 1}`,
        isPrimary: index === primaryImageIndex,
        displayOrder: index
      }));

      const petData: AddPetFormData = {
        name: values.name,
        categoryId: parseInt(values.categoryId),
        species: values.species,
        breed: values.breed,
        gender: values.gender,
        ageMonths: values.ageMonths,
        weight: values.weight,
        color: values.color,
        price: values.price,
        description: values.description || description,
        arrivalDate: values.arrivalDate || new Date().toISOString().split('T')[0],
        status: "available",
        certificateInfo: values.certificateInfo || "",
        healthStatus: values.healthStatus,
        vaccinationStatus: values.vaccinationStatus,
        isActive: values.isActive !== undefined ? values.isActive : true,
        primaryImageUrl: imageUrls[primaryImageIndex] || "",
        images: images.length > 0 ? images : undefined,
      };

      _request({
        path: "/pets",
        method: "POST",
        body: petData,
        onSuccess(response) {
          if (response.success) {
            message.success("Pet added successfully!");
            form.resetFields();
            setDescription("");
            setFileList([]);
            setImageUrls([]);
            setPrimaryImageIndex(0);
          }
          setLoading(false);
        },
        onError(error) {
          console.log("Error adding pet:", error);
          message.error("Failed to add pet. Please try again.");
          setLoading(false);
        },
      });
    } catch (error) {
      console.log("Validation failed:", error);
      message.error("Please fill in all required fields");
      setLoading(false);
    }
  };
  const handleCancel = () => {
    form.resetFields();
    setDescription("");
    setFileList([]);
    setImageUrls([]);
    setPrimaryImageIndex(0);
  };

  return (
    <div className="product-form-container">
      <Form form={form} layout="vertical">
        <Row gutter={24}>
          <Col span={16}>
            <Card className="main-card">
              <Title level={4} className="section-title">
                Thông tin cơ bản
              </Title>

              <Form.Item
                label={<span>Tên thú cưng</span>}
                name="name"
                rules={[
                  { required: true, message: "Tên thú cưng là bắt buộc" },
                ]}
              >
                <Input
                  placeholder="Nhập tên thú cưng"
                  className="product-name-input"
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span>Tuổi (tháng)</span>}
                    name="ageMonths"
                    rules={[{ required: true, message: "Tuổi là bắt buộc" }]}
                  >
                    <InputNumber
                      placeholder="Nhập tuổi (tháng)"
                      className="product-name-input"
                      min={0}
                      max={300}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span>Cân nặng (kg)</span>}
                    name="weight"
                    rules={[
                      { required: true, message: "Cân nặng là bắt buộc" },
                    ]}
                  >
                    <InputNumber
                      placeholder="Nhập cân nặng"
                      className="product-name-input"
                      min={0}
                      step={0.1}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<span>Màu sắc</span>}
                    name="color"
                    rules={[{ required: true, message: "Màu sắc là bắt buộc" }]}
                  >
                    <Input
                      placeholder="Nhập màu sắc"
                      className="product-name-input"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<span>Giới tính</span>}
                    name="gender"
                    rules={[
                      { required: true, message: "Giới tính là bắt buộc" },
                    ]}                  >
                    <Select placeholder="Chọn giới tính">
                      <Option value="male">Đực</Option>
                      <Option value="female">Cái</Option>
                      <Option value="other">Khác</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>              <Form.Item
                label={<span>Giống</span>}
                name="breed"
                rules={[{ required: true, message: "Giống là bắt buộc" }]}
              >
                <Input
                  placeholder="Nhập giống thú cưng"
                  className="product-name-input"
                />
              </Form.Item>

              <Form.Item
                label={<span>Loài</span>}
                name="species"
                rules={[{ required: true, message: "Loài là bắt buộc" }]}
              >
                <Input
                  placeholder="VD: Chó, Mèo, Chim..."
                  className="product-name-input"
                />
              </Form.Item>

              <Divider />

              <Title level={4} className="section-title">
                Hình ảnh và mô tả
              </Title>

              <Dragger {...uploadProps} className="media-upload">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined
                    style={{ fontSize: "48px", color: "#1890ff" }}
                  />
                </p>                <p className="ant-upload-text">
                  Kéo thả hình ảnh vào đây hoặc click để chọn nhiều file
                </p>
                <p className="ant-upload-hint">
                  Chỉ chấp nhận file ảnh (PNG, JPG, JPEG) dưới 5MB. Có thể chọn nhiều ảnh cùng lúc.
                </p>
              </Dragger>              
              <Form.Item
                label={<span>Hoặc nhập URL hình ảnh</span>}
                name="imageUrlInput"
                style={{ marginTop: 16 }}
              >
                <Input
                  placeholder="https://example.com/image.jpg"
                  onChange={(e) => {
                    if (e.target.value) {
                      setImageUrls(prev => [...prev, e.target.value]);
                      setFileList([]); 
                    }
                  }}
                />
              </Form.Item>

              {imageUrls.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <Title level={5}>Xem trước hình ảnh:</Title>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                    {imageUrls.map((url, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            border: primaryImageIndex === index ? "3px solid #1890ff" : "1px solid #d9d9d9",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                          onClick={() => setPrimaryImageIndex(index)}
                        />
                        {primaryImageIndex === index && (
                          <div style={{
                            position: 'absolute',
                            top: '5px',
                            left: '5px',
                            background: '#1890ff',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            Ảnh chính
                          </div>
                        )}
                        <Button
                          type="text"
                          danger
                          size="small"
                          style={{
                            position: 'absolute',
                            top: '5px',
                            right: '5px',
                            background: 'rgba(255,255,255,0.8)'
                          }}
                          onClick={() => {
                            setImageUrls(prev => prev.filter((_, i) => i !== index));
                            if (primaryImageIndex >= index && primaryImageIndex > 0) {
                              setPrimaryImageIndex(prev => prev - 1);
                            }
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 8, fontSize: '12px', color: '#666' }}>
                    Click vào ảnh để chọn làm ảnh chính
                  </div>
                </div>
              )}

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
                    placeholder="Nhập mô tả chi tiết về thú cưng..."
                    value={description}
                    onChange={handleDescriptionChange}
                    className="description-textarea"
                    rows={6}
                  />
                </div>
              </Form.Item>

              <div className="helper-text">
                Thêm mô tả để thú cưng dễ được tìm thấy hơn.
              </div>
            </Card>
          </Col>

          <Col span={8}>
            <div className="sidebar">
              <Card className="thumbnail-card">
                <Title level={5} className="card-title">
                  Thông tin sức khỏe
                </Title>

                <Form.Item
                  label={<span>Tình trạng sức khỏe</span>}
                  name="healthStatus"
                  rules={[
                    {
                      required: true,
                      message: "Tình trạng sức khỏe là bắt buộc",
                    },
                  ]}                >
                  <Select placeholder="Chọn tình trạng sức khỏe">
                    <Option value="excellent">Tuyệt vời</Option>
                    <Option value="good">Tốt</Option>
                    <Option value="fair">Bình thường</Option>
                    <Option value="poor">Kém</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span>Trạng thái tiêm phòng</span>}
                  name="vaccinationStatus"
                  rules={[
                    {
                      required: true,
                      message: "Trạng thái tiêm phòng là bắt buộc",
                    },
                  ]}                >
                  <Select placeholder="Chọn trạng thái tiêm phòng">
                    <Option value="fully_vaccinated">Đã tiêm đủ</Option>
                    <Option value="partially_vaccinated">Tiêm một phần</Option>
                    <Option value="not_vaccinated">Chưa tiêm</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  label={<span>Thông tin chứng nhận</span>}
                  name="certificateInfo"
                >
                  <Input
                    placeholder="VD: VKA, VCK..."
                    className="product-name-input"
                  />
                </Form.Item>
              </Card>              <Card className="files-card">
                <Title level={5}>Thông tin bán hàng</Title>

                <Form.Item
                  label={<span>Giá bán (VND)</span>}
                  name="price"
                  rules={[{ required: true, message: "Giá bán là bắt buộc" }]}
                >
                  <InputNumber
                    placeholder="Nhập giá bán"
                    className="product-name-input"
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  label={<span>Ngày nhập</span>}
                  name="arrivalDate"
                  rules={[{ required: true, message: "Ngày nhập là bắt buộc" }]}
                >
                  <Input
                    type="date"
                    className="product-name-input"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Card>

              <Card className="status-card">
                <div className="status-header">
                  <Title level={5} className="card-title">
                    Trạng thái hoạt động
                  </Title>
                </div>
                <Form.Item name="isActive" valuePropName="checked" initialValue={true}>
                  <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
                </Form.Item>
                <div className="helper-text small">
                  Thiết lập trạng thái hoạt động của thú cưng.
                </div>
              </Card>

              <Card className="details-card">
                <Title level={5} className="card-title">
                  Giống loài
                </Title>

                <div className="detail-section">
                  <label className="detail-label">Danh mục</label>
                  <Form.Item
                    name="categoryId"
                    rules={[
                      { required: true, message: "Danh mục là bắt buộc" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn danh mục"
                      className="categories-select"
                      style={{ width: "100%" }}
                      loading={categories.length === 0}
                    >
                      {categories.map((category) => (
                        <Option key={category.id} value={category.id.toString()}>
                          {category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <div className="helper-text small">
                    Chọn danh mục cho thú cưng.
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        <Row gutter={24} className="actions-btn">
          <Col>
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              icon={loading ? <LoadingOutlined /> : undefined}
            >
              {loading ? "Đang thêm..." : "Thêm thú cưng"}
            </Button>
          </Col>
          <Col>
            <Button type="default" onClick={handleCancel}>
              Hủy bỏ
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddPet;