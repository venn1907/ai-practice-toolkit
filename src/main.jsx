import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  App as AntApp,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  Layout,
  Menu,
  Progress,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  Tag,
  Typography,
  message,
} from "antd";
import {
  Bot,
  CheckCircle2,
  Clipboard,
  FileCheck,
  Library,
  PenTool,
  SearchCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import "antd/dist/reset.css";
import "./styles.css";

const { Header, Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const menuItems = [
  { key: "prompt", icon: <PenTool size={18} />, label: "Prompt Builder" },
  { key: "workflow", icon: <Workflow size={18} />, label: "AI Workflow" },
  { key: "creative", icon: <Sparkles size={18} />, label: "Sáng tạo" },
  { key: "research", icon: <SearchCheck size={18} />, label: "Kiểm chứng" },
  { key: "analytics", icon: <FileCheck size={18} />, label: "Phân tích" },
  { key: "agent", icon: <Bot size={18} />, label: "AI Agent" },
  { key: "library", icon: <Library size={18} />, label: "Thư viện" },
];

const promptExamples = [
  {
    title: "Email thông báo",
    text: "Bạn là trợ lý đào tạo. Hãy viết email gửi sinh viên thông báo lịch nộp báo cáo trước ngày 20/05, văn phong lịch sự, ngắn gọn trong 100 từ. Có tiêu đề email, nội dung email và lời nhắc liên hệ nếu có thắc mắc.",
  },
  {
    title: "Tạo slide",
    text: "Hãy tạo nội dung cho 10 slide về AI cơ bản dành cho người mới bắt đầu. Mỗi slide có tiêu đề, 3 ý chính và ví dụ thực tế dễ hiểu.",
  },
  {
    title: "Tóm tắt tài liệu",
    text: "Tóm tắt văn bản sau thành 5 ý chính. Mỗi ý 1 câu, dùng ngôn ngữ đơn giản, giữ lại số liệu và tên riêng quan trọng.",
  },
];

const copyText = async (text) => {
  await navigator.clipboard.writeText(text);
  message.success("Đã sao chép");
};

const STORAGE_PREFIX = "ai-practice-toolkit";

function readStoredValue(key, fallback) {
  try {
    const rawValue = window.localStorage.getItem(`${STORAGE_PREFIX}:${key}`);
    return rawValue ? JSON.parse(rawValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}:${key}`, JSON.stringify(value));
  } catch {
    // Ignore storage failures so forms still work normally.
  }
}

function useStoredState(key, fallback) {
  const [value, setValue] = useState(() => readStoredValue(key, fallback));

  const updateValue = (nextValue) => {
    setValue((currentValue) => {
      const resolvedValue =
        typeof nextValue === "function" ? nextValue(currentValue) : nextValue;
      writeStoredValue(key, resolvedValue);
      return resolvedValue;
    });
  };

  return [value, updateValue];
}

function useSavedFormValues(key) {
  const [values, setValues] = useStoredState(key, {});

  const handleValuesChange = (_, allValues) => {
    setValues(allValues);
  };

  return [values, handleValuesChange];
}

const englishInterfaceMap = {
  "Trung tâm Chuyển đổi số": "Digital Transformation Center",
  "Bộ công cụ thực hành AI cơ bản": "Basic AI Practice Toolkit",
  "Biến yêu cầu mơ hồ thành prompt có vai trò, bối cảnh, định dạng và tiêu chí rõ ràng.": "Turn vague requests into prompts with clear role, context, format, and criteria.",
  "Context & Data - Prompt Engineering - Verify - Refine, kèm tiêu chí chọn công cụ AI.": "Context & Data - Prompt Engineering - Verify - Refine, with AI tool selection criteria.",
  "Tạo prompt viết nội dung truyền thông, bài phát biểu, báo cáo hoặc ý tưởng hình ảnh theo cấu trúc rõ ràng.": "Create prompts for marketing content, speeches, reports, or visual ideas using a clear structure.",
  "Giúp người học tránh hallucination, kiểm tra trích dẫn, tên miền, ngày tháng và xác thực chéo.": "Help learners avoid hallucinations, check citations, domains, dates, and cross-verify information.",
  "Tạo prompt phân tích mô tả, chẩn đoán, dự báo và đề xuất theo khung trong bài giảng.": "Create prompts for descriptive, diagnostic, predictive, and prescriptive analysis.",
  "Thiết kế instruction, knowledge base và bộ test nhanh cho trợ lý AI cá nhân hoặc FAQ nội bộ.": "Design instructions, knowledge bases, and quick test cases for personal AI assistants or internal FAQs.",
  "Các prompt nền từ bài giảng để học viên sao chép, chỉnh sửa và lưu lại thành tài sản cá nhân.": "Starter prompts from the lessons for learners to copy, edit, and save as personal assets.",
  "Sáng tạo": "Creative",
  "Kiểm chứng": "Verification",
  "Phân tích": "Analytics",
  "Thư viện": "Library",
  "Sao chép": "Copy",
  "Điền thông tin ở bên trái để tạo nội dung mẫu.": "Fill in the fields on the left to generate a draft.",
  "Prompt đã tối ưu": "Optimized Prompt",
  "Vai trò AI": "AI Role",
  "Người đọc/người dùng": "Reader/User",
  "Bối cảnh": "Context",
  "Việc cần AI làm": "Task for AI",
  "Văn phong": "Tone",
  "Định dạng đầu ra": "Output Format",
  "Ràng buộc": "Constraints",
  "Ví dụ mẫu": "Example",
  "Chọn văn phong": "Select tone",
  "Lịch sự": "Polite",
  "Ngắn gọn": "Concise",
  "Học thuật": "Academic",
  "Truyền cảm hứng": "Inspirational",
  "Mục tiêu công việc": "Work Goal",
  "Context & Data": "Context & Data",
  "Tiêu chí 1: Tính chất công việc": "Criterion 1: Work Type",
  "Tiêu chí 2: Nguồn dữ liệu": "Criterion 2: Data Source",
  "Tiêu chí 3: Bảo mật & tuân thủ": "Criterion 3: Security & Compliance",
  "Tiêu chí 4: Hệ sinh thái": "Criterion 4: Ecosystem",
  "Tiêu chí 5: Chi phí & ROI": "Criterion 5: Cost & ROI",
  "Chọn nhóm việc": "Select work type",
  "Chọn nguồn dữ liệu": "Select data source",
  "Chọn hệ sinh thái": "Select ecosystem",
  "Chọn mức đầu tư": "Select investment level",
  "Workflow": "Workflow",
  "Thông tin bối cảnh": "Context Information",
  "Đối tượng": "Audience",
  "Kênh": "Channel",
  "Độ dài": "Length",
  "Chọn kênh": "Select channel",
  "Bài phát biểu": "Speech",
  "Prompt sáng tạo AIDA": "AIDA Creative Prompt",
  "Prompt kiểm chứng": "Verification Prompt",
  "Câu hỏi phân tích": "Analysis Question",
  "Phạm vi dữ liệu": "Data Scope",
  "Bối cảnh nghiệp vụ": "Business Context",
  "Cần so sánh": "Compare By",
  "Tên trợ lý": "Assistant Name",
  "Vai trò": "Role",
  "Mục tiêu": "Goal",
  "Phạm vi/giới hạn": "Scope/Limits",
  "Test case nhanh": "Quick Test Case",
  "Instruction": "Instruction",
  "YAML cấu hình": "YAML Config",
  "Tạo slide": "Create Slides",
  "Tóm tắt tài liệu": "Summarize Document",
  "Email thông báo": "Notification Email",
};

const englishAttributeMap = {
  "VD: chuyên viên đào tạo": "E.g. training specialist",
  "VD: sinh viên năm nhất": "E.g. first-year students",
  "Tình huống, lĩnh vực, dữ liệu nền...": "Situation, field, background data...",
  "VD: soạn email, tạo slide, phân tích dữ liệu...": "E.g. write an email, create slides, analyze data...",
  "VD: bảng, 8 slide, 5 bullet...": "E.g. table, 8 slides, 5 bullets...",
  "VD: dưới 150 từ, có CTA, không dùng thuật ngữ kỹ thuật": "E.g. under 150 words, include CTA, avoid technical jargon",
  "Dán mẫu phong cách hoặc cấu trúc mong muốn": "Paste a preferred style or structure sample",
  "VD: chuẩn bị báo cáo tổng kết tháng": "E.g. prepare a monthly summary report",
  "VD: chuyên gia marketing, trợ lý đào tạo, chuyên viên phân tích": "E.g. marketing expert, training assistant, analyst",
  "Dữ liệu nền, tài liệu tham khảo, email, số liệu, quy định...": "Background data, references, emails, figures, policies...",
  "VD: bảng hành động, email, 8 slide, checklist": "E.g. action table, email, 8 slides, checklist",
  "VD: không đưa danh sách khách hàng, mã nguồn, chiến lược chưa công bố lên AI miễn phí": "E.g. do not upload customer lists, source code, or unpublished strategy to free AI tools",
  "VD: khóa học AI cơ bản cho giảng viên": "E.g. basic AI course for lecturers, target learners, key benefits, timeline, and communication goal",
  "VD: nhân viên hành chính, giảng viên, sinh viên": "E.g. admin staff, lecturers, students",
  "VD: 150 từ, 5 phút, 8 slide": "E.g. 150 words, 5 minutes, 8 slides",
  "VD: Vì sao doanh số tháng này giảm và nên làm gì?": "E.g. Why did sales drop this month and what should we do?",
  "VD: doanh số 6 tháng, 3 chi nhánh": "E.g. 6 months of sales, 3 branches",
  "VD: vừa chạy chiến dịch marketing mới": "E.g. just launched a new marketing campaign",
  "VD: theo tháng, nhóm khách hàng": "E.g. by month, customer segment",
  "VD: bảng + 5 khuyến nghị": "E.g. table + 5 recommendations",
  "VD: Trợ giảng AI cơ bản": "E.g. Basic AI Teaching Assistant",
  "VD: tro_giang, faq_noi_bo, tro_ly_ca_nhan": "E.g. teaching_assistant, internal_faq, personal_assistant",
  "Trợ lý này giúp ai, làm việc gì?": "Who does this assistant help, and what does it do?",
  "Không trả lời vấn đề nào? Dựa trên nguồn nào?": "What should it not answer? Which sources should it use?",
  "VD: AI Agent khác chatbot ở đâu?": "E.g. How is an AI Agent different from a chatbot?",
};

function applyEnglishInterface(root) {
  const textNodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    textNodes.push(currentNode);
    currentNode = walker.nextNode();
  }

  textNodes.forEach((node) => {
    const originalText = node.nodeValue;
    const trimmedText = originalText.trim();

    if (englishInterfaceMap[trimmedText]) {
      node.nodeValue = originalText.replace(trimmedText, englishInterfaceMap[trimmedText]);
    }
  });

  root.querySelectorAll("[placeholder]").forEach((element) => {
    const placeholder = element.getAttribute("placeholder");
    if (englishAttributeMap[placeholder]) {
      element.setAttribute("placeholder", englishAttributeMap[placeholder]);
    }
  });
}

function OutputCard({ title, value }) {
  return (
    <Card className="output-card" title={title}>
      <pre>{value || "Điền thông tin ở bên trái để tạo nội dung mẫu."}</pre>
      <Button
        icon={<Clipboard size={16} />}
        disabled={!value}
        onClick={() => copyText(value)}
      >
        Sao chép
      </Button>
    </Card>
  );
}

function PromptBuilder({ language = "vi" }) {
  const [form] = Form.useForm();
  const [storedValues, handleStoredValuesChange] = useSavedFormValues("prompt-builder");
  const [result, setResult] = useState("");

  const buildPrompt = (nextValues) => {
    const values = nextValues || form.getFieldsValue();
    if (language === "en") {
      const prompt = [
        values.role && `You are ${values.role}.`,
        values.context && `Context: ${values.context}`,
        values.task && `Task: ${values.task}`,
        values.audience && `Target audience: ${values.audience}`,
        values.tone && `Tone: ${values.tone}.`,
        values.format && `Output format: ${values.format}.`,
        values.constraints && `Constraints: ${values.constraints}`,
        values.example && `Reference example: ${values.example}`,
        "Before answering, check whether the request is missing any important information. If something is missing, ask a brief clarifying question.",
      ]
        .filter(Boolean)
        .join("\n");
      setResult(prompt);
      return;
    }
    const prompt = [
      values.role && `Bạn là ${values.role}.`,
      values.context && `Bối cảnh: ${values.context}`,
      values.task && `Nhiệm vụ: ${values.task}`,
      values.audience && `Đối tượng nhận kết quả: ${values.audience}`,
      values.tone && `Văn phong: ${values.tone}.`,
      values.format && `Định dạng đầu ra: ${values.format}.`,
      values.constraints && `Ràng buộc: ${values.constraints}`,
      values.example && `Ví dụ/mẫu tham khảo: ${values.example}`,
      "Trước khi trả lời, hãy kiểm tra xem yêu cầu còn thiếu thông tin quan trọng nào không. Nếu thiếu, hãy hỏi lại ngắn gọn.",
    ]
      .filter(Boolean)
      .join("\n");
    setResult(prompt);
  };

  useEffect(() => {
    form.setFieldsValue(storedValues);
    buildPrompt(storedValues);
  }, []);

  useEffect(() => {
    buildPrompt(form.getFieldsValue());
  }, [language]);

  return (
    <ToolShell
      icon={<PenTool />}
      title="Prompt Builder"
      subtitle="Biến yêu cầu mơ hồ thành prompt có vai trò, bối cảnh, định dạng và tiêu chí rõ ràng."
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={13}>
          <Card>
            <Form
              form={form}
              layout="vertical"
              initialValues={storedValues}
              onValuesChange={(_, allValues) => {
                handleStoredValuesChange(_, allValues);
                buildPrompt(allValues);
              }}
            >
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="role" label="Vai trò AI">
                    <Input placeholder="VD: chuyên viên đào tạo" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="audience" label="Người đọc/người dùng">
                    <Input placeholder="VD: sinh viên năm nhất" />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="context" label="Bối cảnh">
                <TextArea
                  rows={3}
                  placeholder="Tình huống, lĩnh vực, dữ liệu nền..."
                />
              </Form.Item>
              <Form.Item name="task" label="Việc cần AI làm">
                <TextArea
                  rows={3}
                  placeholder="VD: soạn email, tạo slide, phân tích dữ liệu..."
                />
              </Form.Item>
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="tone" label="Văn phong">
                    <Select
                      placeholder="Chọn văn phong"
                      options={[
                        {
                          value: "lịch sự, rõ ràng, dễ hiểu",
                          label: "Lịch sự",
                        },
                        {
                          value: "ngắn gọn, trực tiếp, thực tế",
                          label: "Ngắn gọn",
                        },
                        { value: "học thuật, có lập luận", label: "Học thuật" },
                        {
                          value: "truyền cảm hứng, gần gũi",
                          label: "Truyền cảm hứng",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="format" label="Định dạng đầu ra">
                    <Input placeholder="VD: bảng, 8 slide, 5 bullet..." />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item name="constraints" label="Ràng buộc">
                <Input placeholder="VD: dưới 150 từ, có CTA, không dùng thuật ngữ kỹ thuật" />
              </Form.Item>
              <Form.Item name="example" label="Ví dụ mẫu">
                <TextArea
                  rows={2}
                  placeholder="Dán mẫu phong cách hoặc cấu trúc mong muốn"
                />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={11}>
          <OutputCard title="Prompt đã tối ưu" value={result} />
        </Col>
      </Row>
    </ToolShell>
  );
}

function WorkflowPlanner() {
  const [values, setValues] = useState({});
  const output = useMemo(() => {
    if (!values.goal) return "";
    return `Mục tiêu công việc: ${values.goal}

1. Preparation
- Dữ liệu cần chuẩn bị: ${values.inputs || "liệt kê tài liệu, số liệu, bối cảnh liên quan"}
- Tiêu chí thành công: ${values.success || "đúng, đủ, dễ hiểu, dùng được ngay"}

2. Generation
- Prompt khởi tạo: Hãy hỗ trợ tôi hoàn thành mục tiêu trên theo từng bước, nêu giả định và đề xuất đầu ra phù hợp.
- Công cụ nên dùng: ${values.toolType || "AI tạo sinh phổ thông"}

3. Verification
- Kiểm tra số liệu, ngày tháng, tên riêng.
- Đối chiếu nguồn trích dẫn và kiểm tra thiên kiến.
- Không nhập dữ liệu nhạy cảm lên công cụ AI công cộng.

4. Refinement
- Điều chỉnh văn phong theo người nhận.
- Bổ sung kinh nghiệm thực tế mà AI không biết.
- Lưu prompt tốt thành template cho lần sau.`;
  }, [values]);

  return (
    <ToolShell
      icon={<Workflow />}
      title="AI Workflow Planner"
      subtitle="Áp dụng quy trình Preparation - Generation - Verification - Refinement cho công việc hằng ngày."
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Form layout="vertical" onValuesChange={(_, all) => setValues(all)}>
              <Form.Item name="goal" label="Mục tiêu công việc">
                <Input placeholder="VD: chuẩn bị báo cáo tổng kết tháng" />
              </Form.Item>
              <Form.Item name="inputs" label="Dữ liệu đầu vào">
                <TextArea
                  rows={3}
                  placeholder="Tài liệu, số liệu, email, quy định..."
                />
              </Form.Item>
              <Form.Item name="toolType" label="Loại công cụ AI phù hợp">
                <Select
                  placeholder="Chọn theo tính chất công việc"
                  options={[
                    {
                      value: "ChatGPT/Claude/Gemini cho viết và tổng hợp",
                      label: "Viết & tổng hợp",
                    },
                    {
                      value: "Perplexity/Gemini cho tìm kiếm có nguồn",
                      label: "Tra cứu online",
                    },
                    {
                      value: "NotebookLM/Claude cho tài liệu tải lên",
                      label: "Xử lý tài liệu",
                    },
                    {
                      value:
                        "Copilot/Gemini Workspace nếu làm trong hệ sinh thái văn phòng",
                      label: "Office workspace",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="success" label="Tiêu chí thành công">
                <Input placeholder="VD: có 3 insight, bảng hành động, dưới 2 trang" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <OutputCard title="Kế hoạch workflow" value={output} />
        </Col>
      </Row>
    </ToolShell>
  );
}

function suggestChapter3Tools(values) {
  const suggestions = [];

  if (values.workType?.includes("Sáng tạo")) {
    suggestions.push(
      "- ChatGPT/Claude: viết lách, brainstorming; Canva/Gamma: thiết kế và slide.",
    );
  }
  if (values.workType?.includes("Phân tích")) {
    suggestions.push(
      "- ChatGPT/Claude: phân tích logic; NotebookLM: phân tích tài liệu nội bộ; Formula Bot: công thức Excel.",
    );
  }
  if (values.workType?.includes("Tra cứu")) {
    suggestions.push(
      "- Perplexity/Gemini: tìm kiếm thông tin thời gian thực có nguồn dẫn.",
    );
  }
  if (values.dataSource?.includes("offline")) {
    suggestions.push(
      "- NotebookLM/Claude: ưu tiên khi cần đọc tệp tải lên và bám sát nguồn tài liệu.",
    );
  }
  if (values.dataSource?.includes("online")) {
    suggestions.push(
      "- Perplexity/Gemini: ưu tiên khi cần dữ liệu mới, link nguồn và tra cứu web.",
    );
  }
  if (values.ecosystem?.includes("Microsoft")) {
    suggestions.push(
      "- Copilot: phù hợp khi công việc nằm trong Word, Excel, Microsoft 365.",
    );
  }
  if (values.ecosystem?.includes("Google")) {
    suggestions.push(
      "- Gemini: phù hợp khi công việc nằm trong Gmail, Docs, Sheets, Drive.",
    );
  }

  return suggestions.length
    ? suggestions.join("\n")
    : "- Chọn công cụ theo đúng việc: ChatGPT/Claude cho viết và lập luận, Gemini/Perplexity cho tra cứu, NotebookLM cho tài liệu tải lên.";
}

function WorkflowPlannerChapter3({ language = "vi" }) {
  const [values, handleValuesChange] = useSavedFormValues("workflow-planner");
  const output = useMemo(() => {
    if (!values.goal) return "";

    if (language === "en") {
      const toolSuggestions = [
        values.workType && `- Work type: ${values.workType}`,
        values.dataSource && `- Data source: ${values.dataSource}`,
        values.ecosystem && `- Ecosystem: ${values.ecosystem}`,
        "- Consider ChatGPT/Claude for writing and reasoning, Gemini/Perplexity for web research, NotebookLM for uploaded documents, and Copilot/Gemini Workspace when work happens inside office suites.",
      ]
        .filter(Boolean)
        .join("\n");

      return `AI Workflow

Work goal: ${values.goal}
AI Co-pilot mindset: You provide direction and make the final decision; AI helps execute faster, summarize, and suggest ideas.

Stage 1: Context & Data
- AI role: ${values.role || "define a clear role, such as marketing expert, training assistant, or analyst"}
- Context/data to provide: ${values.inputs || "reference documents, background information, and specific requirements"}
- Clean the input: remove irrelevant information, organize by timeline/topic, and remove sensitive data before uploading to cloud tools.

Stage 2: Prompt Engineering
- Sample prompt:
You are ${values.role || "a professional assistant"}. Help me complete this task: ${values.goal}.
Context/data: ${values.inputs || "[paste cleaned data here]"}.
Work step by step and avoid generic answers.
Output format: ${values.format || "clear bullet list or table"}.
- For emails/announcements, include greeting, time/location, objective, preparation materials, and a confirmation request.

Stage 3: Verify
- Check numbers, dates, and proper names.
- Check whether citations/source links are real.
- Assess objectivity, bias, and possible hallucinations.
- Rule: trust but verify.

Stage 4: Refine
- Adjust tone to fit the organization/unit culture.
- Add real-world experience that AI does not know.
- Revise important content to improve ownership and reduce copyright risk.
- Save strong prompts as templates for later.

Tool selection suggestions
- Work type: ${values.workType || "creative / analytical / research"}
- Data source: ${values.dataSource || "online / offline / internal system"}
- Security & compliance: ${values.security || "check customer data, source code, and unpublished strategy"}
- Available ecosystem: ${values.ecosystem || "Microsoft 365 / Google Workspace / standalone tools"}
- Cost & ROI: ${values.roi || "free / pro / enterprise"}

Tools to consider:
${toolSuggestions}`;
    }

    return `Workflow ứng dụng AI

Mục tiêu công việc: ${values.goal}
Tư duy AI Co-pilot: Bạn định hướng và quyết định cuối cùng; AI hỗ trợ thực thi nhanh, tóm tắt và gợi ý.

GĐ 1: Context & Data
- Vai trò AI: ${values.role || "xác định rõ vai trò, ví dụ chuyên gia marketing, trợ lý đào tạo"}
- Dữ liệu/bối cảnh cần cung cấp: ${values.inputs || "tài liệu tham khảo, thông tin nền, yêu cầu cụ thể"}
- Làm sạch đầu vào: bỏ thông tin dư thừa, sắp xếp theo thời gian/chủ đề, loại bỏ dữ liệu nhạy cảm trước khi đưa lên cloud.

GĐ 2: Prompt Engineering
- Prompt mẫu:
Bạn là ${values.role || "trợ lý chuyên môn"}. Hãy hỗ trợ tôi hoàn thành nhiệm vụ: ${values.goal}.
Bối cảnh/dữ liệu: ${values.inputs || "[dán dữ liệu đã làm sạch]"}.
Yêu cầu làm theo từng bước, tránh trả lời chung chung.
Định dạng đầu ra: ${values.format || "danh sách gạch đầu dòng hoặc bảng rõ ràng"}.
- Nếu là email/thông báo, hãy nêu đủ: lời chào, thời gian/địa điểm, mục tiêu, tài liệu cần chuẩn bị và yêu cầu phản hồi xác nhận.

GĐ 3: Verify
- Kiểm tra số liệu, ngày tháng và tên riêng.
- Kiểm tra citation/link nguồn xem có thực hay không.
- Đánh giá tính khách quan, định kiến và khả năng AI bịa thông tin.
- Quy tắc: tin tưởng nhưng phải kiểm chứng.

GĐ 4: Refine
- Điều chỉnh giọng văn cho phù hợp văn hóa doanh nghiệp/đơn vị.
- Bổ sung kinh nghiệm thực tế mà AI không biết.
- Chỉnh sửa lại nội dung quan trọng để tăng tính sở hữu và giảm rủi ro bản quyền.
- Lưu prompt tốt thành template cho lần sau.

Gợi ý chọn công cụ
- Tính chất công việc: ${values.workType || "sáng tạo / phân tích / tra cứu"}
- Nguồn dữ liệu: ${values.dataSource || "online / offline / hệ thống"}
- Bảo mật & tuân thủ: ${values.security || "kiểm tra dữ liệu khách hàng, mã nguồn, chiến lược chưa công bố"}
- Hệ sinh thái sẵn có: ${values.ecosystem || "Microsoft 365 / Google Workspace / công cụ độc lập"}
- Chi phí & ROI: ${values.roi || "miễn phí / pro / enterprise"}

Công cụ nên cân nhắc:
${suggestChapter3Tools(values)}`;
  }, [values, language]);

  return (
    <ToolShell
      icon={<Workflow />}
      title="AI Workflow Planner"
      subtitle="Context & Data - Prompt Engineering - Verify - Refine, kèm tiêu chí chọn công cụ AI."
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Form
              layout="vertical"
              initialValues={values}
              onValuesChange={handleValuesChange}
            >
              <Form.Item name="goal" label="Mục tiêu công việc">
                <Input placeholder="VD: chuẩn bị báo cáo tổng kết tháng" />
              </Form.Item>
              <Form.Item name="role" label="Vai trò AI">
                <Input placeholder="VD: chuyên gia marketing, trợ lý đào tạo, chuyên viên phân tích" />
              </Form.Item>
              <Form.Item name="inputs" label="Context & Data">
                <TextArea
                  rows={3}
                  placeholder="Dữ liệu nền, tài liệu tham khảo, email, số liệu, quy định..."
                />
              </Form.Item>
              <Form.Item name="format" label="Định dạng đầu ra">
                <Input placeholder="VD: bảng hành động, email, 8 slide, checklist" />
              </Form.Item>
              <Form.Item
                name="workType"
                label="Tiêu chí 1: Tính chất công việc"
              >
                <Select
                  placeholder="Chọn nhóm việc"
                  options={[
                    {
                      value:
                        "Sáng tạo: viết content, lên ý tưởng, thiết kế hình ảnh",
                      label: "Sáng tạo",
                    },
                    {
                      value:
                        "Phân tích: xử lý số liệu, lập trình, tóm tắt báo cáo",
                      label: "Phân tích",
                    },
                    {
                      value:
                        "Tra cứu: tìm kiếm thông tin, nghiên cứu thị trường",
                      label: "Tra cứu",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="dataSource" label="Tiêu chí 2: Nguồn dữ liệu">
                <Select
                  placeholder="Chọn nguồn dữ liệu"
                  options={[
                    {
                      value:
                        "Dữ liệu online: cần AI có kết nối internet thời gian thực",
                      label: "Online",
                    },
                    {
                      value: "Dữ liệu offline: cần AI đọc và hiểu tệp tải lên",
                      label: "Offline/file tải lên",
                    },
                    {
                      value: "Dữ liệu hệ thống: cần AI tích hợp CRM/ERP/nội bộ",
                      label: "Hệ thống",
                    },
                  ]}
                />
              </Form.Item>
              <Form.Item name="security" label="Tiêu chí 3: Bảo mật & tuân thủ">
                <Input placeholder="VD: không đưa danh sách khách hàng, mã nguồn, chiến lược chưa công bố lên AI miễn phí" />
              </Form.Item>
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="ecosystem" label="Tiêu chí 4: Hệ sinh thái">
                    <Select
                      placeholder="Chọn hệ sinh thái"
                      options={[
                        {
                          value:
                            "Microsoft 365: ưu tiên Copilot trong Word, Excel",
                          label: "Microsoft 365",
                        },
                        {
                          value:
                            "Google Workspace: ưu tiên Gemini trong Gmail, Docs",
                          label: "Google Workspace",
                        },
                        {
                          value:
                            "Công cụ độc lập: dùng cho nhu cầu chuyên biệt",
                          label: "Độc lập",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="roi" label="Tiêu chí 5: Chi phí & ROI">
                    <Select
                      placeholder="Chọn mức đầu tư"
                      options={[
                        {
                          value:
                            "Miễn phí: phù hợp thử nghiệm, hạn chế tốc độ/tính năng",
                          label: "Miễn phí",
                        },
                        {
                          value:
                            "Pro: tăng năng suất, cần tính lợi ích kinh tế",
                          label: "Pro",
                        },
                        {
                          value:
                            "Enterprise: quản lý tập trung, bảo mật cao nhất",
                          label: "Enterprise",
                        },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <OutputCard title="Workflow" value={output} />
        </Col>
      </Row>
    </ToolShell>
  );
}

function CreativeTool({ language = "vi" }) {
  const [values, handleValuesChange] = useSavedFormValues("creative-tool");
  const englishOutput = values.topic
    ? `Write content using the AIDA formula for this content: ${values.topic}

Audience: ${values.audience || "newly interested users"}
Channel: ${values.channel || "social media post"}
Length: ${values.length || "150-200 words"}

Attention: Start with an attention-grabbing headline or question.
Interest: Describe the audience's real problem and the key benefit.
Desire: Build desire with an example, evidence, result, or short story.
Action: End with a clear call to action.

Additional requirements:
- Use simple language and avoid difficult jargon.
- Provide 3 headline options.
- Suggest 1 suitable illustration or infographic idea.`
    : "";
  const output = values.topic
    ? `Hãy viết nội dung theo công thức AIDA cho nội dung: ${values.topic}

Đối tượng: ${values.audience || "người mới quan tâm"}
Kênh sử dụng: ${values.channel || "bài đăng mạng xã hội"}
Độ dài: ${values.length || "150-200 từ"}

Attention: Mở đầu bằng tiêu đề hoặc câu hỏi gây chú ý.
Interest: Nêu vấn đề thật của đối tượng và lợi ích chính.
Desire: Tạo mong muốn bằng ví dụ, bằng chứng, kết quả hoặc câu chuyện ngắn.
Action: Kết thúc bằng lời kêu gọi hành động rõ ràng.

Yêu cầu thêm:
- Ngôn ngữ dễ hiểu, tránh thuật ngữ khó.
- Đưa ra 3 phương án tiêu đề.
- Gợi ý 1 hình ảnh minh họa hoặc infographic phù hợp.`
    : "";

  return (
    <ToolShell
      icon={<Sparkles />}
      title="AIDA Content Assistant"
      subtitle="Tạo prompt viết nội dung truyền thông, bài phát biểu, báo cáo hoặc ý tưởng hình ảnh theo cấu trúc rõ ràng."
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Form
              layout="vertical"
              initialValues={values}
              onValuesChange={handleValuesChange}
            >
              <Form.Item name="topic" label="Thông tin bối cảnh">
                <TextArea rows={4} placeholder="VD: khóa học AI cơ bản cho giảng viên" />
              </Form.Item>
              <Form.Item name="audience" label="Đối tượng">
                <Input placeholder="VD: nhân viên hành chính, giảng viên, sinh viên" />
              </Form.Item>
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="channel" label="Kênh">
                    <Select
                      placeholder="Chọn kênh"
                      options={[
                        { value: "Facebook", label: "Facebook" },
                        { value: "Email", label: "Email" },
                        { value: "Bài phát biểu", label: "Bài phát biểu" },
                        { value: "Slide thuyết trình", label: "Slide" },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="length" label="Độ dài">
                    <Input placeholder="VD: 150 từ, 5 phút, 8 slide" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <OutputCard title="Prompt sáng tạo AIDA" value={language === "en" ? englishOutput : output} />
        </Col>
      </Row>
    </ToolShell>
  );
}

function ResearchVerifier({ language = "vi" }) {
  const [checked, setChecked] = useStoredState("research-verifier", []);
  const percent = Math.round((checked.length / 6) * 100);
  const checklist = [
    "Có link nguồn gốc, không chỉ có phần tóm tắt của AI",
    "Tên miền phù hợp: .gov, .edu, tổ chức chính thống hoặc báo cáo uy tín",
    "Nội dung trong link thực sự khớp với điều AI đang nói",
    "Ngày xuất bản đủ mới so với câu hỏi",
    "Thông tin quan trọng được xác thực chéo bằng ít nhất 2 nguồn",
    "Đã ghi chú rủi ro: thiên kiến, dữ liệu thiếu, số liệu chưa chắc chắn",
  ];
  const output = `Prompt kiểm chứng nguồn:

Hãy kiểm tra thông tin sau theo phương pháp lateral reading.
1. Tách các khẳng định chính cần kiểm chứng.
2. Với mỗi khẳng định, đề xuất loại nguồn đáng tin cậy nên dùng.
3. Chấm mức tin cậy: Cao / Trung bình / Thấp.
4. Chỉ rõ thông tin nào cần kiểm tra thêm.
5. Không bịa nguồn. Nếu không chắc, nói rõ là chưa đủ bằng chứng.

Thông tin cần kiểm chứng:
[Dán nội dung tại đây]`;
  const englishOutput = `Source verification prompt:

Check the following information using lateral reading.
1. Split the content into key claims that need verification.
2. For each claim, suggest the type of reliable source to use.
3. Rate confidence: High / Medium / Low.
4. Clearly state which information needs further checking.
5. Do not fabricate sources. If unsure, say that there is not enough evidence.

Information to verify:
[Paste content here]`;

  return (
    <ToolShell
      icon={<SearchCheck />}
      title="Research Verification Checklist"
      subtitle="Giúp người học tránh hallucination, kiểm tra trích dẫn, tên miền, ngày tháng và xác thực chéo."
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Space direction="vertical" size={16} className="full-width">
              <Progress percent={percent} />
              <Checkbox.Group
                value={checked}
                onChange={setChecked}
                className="checklist"
              >
                {checklist.map((item) => (
                  <Checkbox key={item} value={item}>
                    {item}
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <OutputCard title="Prompt kiểm chứng" value={language === "en" ? englishOutput : output} />
        </Col>
      </Row>
    </ToolShell>
  );
}

function AnalyticsTool({ language = "vi" }) {
  const [values, handleValuesChange] = useSavedFormValues("analytics-tool");
  const englishOutput = values.question
    ? `Analyze the data using the ANALYTICA framework.

A - Analyze: The data scope is ${values.scope || "the provided dataset"}.
N - Narrative: The business context is ${values.context || "not provided; ask a clarification question if needed"}.
A - Actionable: Provide recommendations that can be implemented immediately.
L - Logic: Explain the reasoning chain before giving conclusions.
Y - Yield: Output the result as ${values.format || "a summary table and bullet points"}.
T - Trends: Identify key trends, patterns, and anomalies.
I - Insights: Extract insights that support decision-making.
C - Compare: Compare by ${values.compare || "suitable groups, time periods, or scenarios"}.
A - Assumptions: List assumptions and analysis limitations.

Analysis question: ${values.question}

Data:
[Paste CSV, Excel table, or data description here]`
    : "";
  const output = values.question
    ? `Hãy phân tích dữ liệu theo khung ANALYTICA.

A - Analyze: Phạm vi dữ liệu là ${values.scope || "dữ liệu được cung cấp"}.
N - Narrative: Bối cảnh nghiệp vụ là ${values.context || "chưa có, hãy hỏi lại nếu cần"}.
A - Actionable: Đưa ra đề xuất có thể thực hiện ngay.
L - Logic: Giải thích chuỗi suy luận trước khi kết luận.
Y - Yield: Xuất kết quả dạng ${values.format || "bảng tóm tắt và bullet"}.
T - Trends: Tìm xu hướng, mẫu hình, điểm bất thường.
I - Insights: Rút ra insight có giá trị cho quyết định.
C - Compare: So sánh theo ${values.compare || "nhóm, thời gian hoặc kịch bản phù hợp"}.
A - Assumptions: Liệt kê giả định và giới hạn phân tích.

Câu hỏi phân tích: ${values.question}

Dữ liệu:
[Dán CSV, bảng Excel hoặc mô tả dữ liệu tại đây]`
    : "";

  return (
    <ToolShell
      icon={<FileCheck />}
      title="ANALYTICA Data Prompt"
      subtitle="Tạo prompt phân tích mô tả, chẩn đoán, dự báo và đề xuất theo khung trong bài giảng."
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Form
              layout="vertical"
              initialValues={values}
              onValuesChange={handleValuesChange}
            >
              <Form.Item name="question" label="Câu hỏi phân tích">
                <TextArea
                  rows={3}
                  placeholder="VD: Vì sao doanh số tháng này giảm và nên làm gì?"
                />
              </Form.Item>
              <Form.Item name="scope" label="Phạm vi dữ liệu">
                <Input placeholder="VD: doanh số 6 tháng, 3 chi nhánh" />
              </Form.Item>
              <Form.Item name="context" label="Bối cảnh nghiệp vụ">
                <Input placeholder="VD: vừa chạy chiến dịch marketing mới" />
              </Form.Item>
              <Row gutter={12}>
                <Col xs={24} md={12}>
                  <Form.Item name="compare" label="Cần so sánh">
                    <Input placeholder="VD: theo tháng, nhóm khách hàng" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item name="format" label="Định dạng đầu ra">
                    <Input placeholder="VD: bảng + 5 khuyến nghị" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <OutputCard title="Prompt ANALYTICA" value={language === "en" ? englishOutput : output} />
        </Col>
      </Row>
    </ToolShell>
  );
}

function AgentDesigner({ language = "vi" }) {
  const [values, handleValuesChange] = useSavedFormValues("agent-designer");
  const englishInstruction = values.name
    ? `You are ${values.name}.

Goal:
- ${values.goal || "Help users complete tasks within the assigned scope."}

Response scope:
- ${values.scope || "Answer only based on the provided documents and knowledge."}

Style:
- Concise, clear, and easy to understand for non-technical users.
- Prioritize practical examples.
- If the documents do not contain the information, clearly say there is not enough data.

Response process:
1. Understand the request.
2. State assumptions if any.
3. Answer step by step.
4. Suggest the next step or ask a clarification question when needed.`
    : "";
  const instruction = values.name
    ? `Bạn là ${values.name}.

Mục tiêu:
- ${values.goal || "Hỗ trợ người dùng hoàn thành nhiệm vụ trong phạm vi được giao."}

Phạm vi trả lời:
- ${values.scope || "Chỉ trả lời dựa trên tài liệu và kiến thức được cung cấp."}

Phong cách:
- Ngắn gọn, rõ ý, dễ hiểu với người không chuyên.
- Ưu tiên ví dụ thực tế.
- Nếu tài liệu không có thông tin, nói rõ là chưa đủ dữ liệu.

Quy trình phản hồi:
1. Hiểu yêu cầu.
2. Nêu giả định nếu có.
3. Trả lời theo từng bước.
4. Đề xuất bước tiếp theo hoặc câu hỏi làm rõ khi cần.`
    : "";
  const yaml = values.name
    ? `name: ${values.name.toLowerCase().replaceAll(" ", "_")}
role: ${values.role || "assistant"}
model: gpt-4.1-mini
knowledge_base: knowledge.md
tools:
  - retrieval
response_style:
  - ngan_gon
  - ro_y
  - noi_ro_khi_thieu_du_lieu
test_cases:
  - "${values.test || "Người dùng hỏi một câu ngoài phạm vi tài liệu"}"`
    : "";

  const englishYaml = values.name
    ? `name: ${values.name.toLowerCase().replaceAll(" ", "_")}
role: ${values.role || "assistant"}
model: gpt-4.1-mini
knowledge_base: knowledge.md
tools:
  - retrieval
response_style:
  - concise
  - clear
  - say_when_data_is_missing
test_cases:
  - "${values.test || "User asks a question outside the document scope"}"`
    : "";

  return (
    <ToolShell
      icon={<Bot />}
      title="AI Agent Designer"
      subtitle="Thiết kế instruction, knowledge base và bộ test nhanh cho trợ lý AI cá nhân hoặc FAQ nội bộ."
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Form
              layout="vertical"
              initialValues={values}
              onValuesChange={handleValuesChange}
            >
              <Form.Item name="name" label="Tên trợ lý">
                <Input placeholder="VD: Trợ giảng AI cơ bản" />
              </Form.Item>
              <Form.Item name="role" label="Vai trò">
                <Input placeholder="VD: tro_giang, faq_noi_bo, tro_ly_ca_nhan" />
              </Form.Item>
              <Form.Item name="goal" label="Mục tiêu">
                <TextArea
                  rows={2}
                  placeholder="Trợ lý này giúp ai, làm việc gì?"
                />
              </Form.Item>
              <Form.Item name="scope" label="Phạm vi/giới hạn">
                <TextArea
                  rows={2}
                  placeholder="Không trả lời vấn đề nào? Dựa trên nguồn nào?"
                />
              </Form.Item>
              <Form.Item name="test" label="Test case nhanh">
                <Input placeholder="VD: AI Agent khác chatbot ở đâu?" />
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Tabs
            items={[
              {
                key: "instruction",
                label: "instruction.txt",
                children: (
                  <OutputCard
                    title="Instruction"
                    value={language === "en" ? englishInstruction : instruction}
                  />
                ),
              },
              {
                key: "yaml",
                label: "agent.yaml",
                children: (
                  <OutputCard
                    title="YAML cấu hình"
                    value={language === "en" ? englishYaml : yaml}
                  />
                ),
              },
            ]}
          />
        </Col>
      </Row>
    </ToolShell>
  );
}

function PromptLibrary({ language = "vi" }) {
  const englishExamples = [
    {
      title: "Notification Email",
      text: "You are a training assistant. Write an email to students announcing that the report submission deadline is before May 20. Use a polite tone, keep it under 100 words, and include an email subject, email body, and contact reminder for questions.",
    },
    {
      title: "Create Slides",
      text: "Create content for 10 slides about basic AI for beginners. Each slide should include a title, 3 key points, and a practical easy-to-understand example.",
    },
    {
      title: "Summarize Document",
      text: "Summarize the following text into 5 main points. Each point should be 1 sentence, use simple language, and preserve important numbers and proper names.",
    },
  ];
  const examples = language === "en" ? englishExamples : promptExamples;

  return (
    <ToolShell
      icon={<Library />}
      title="Thư viện prompt mẫu"
      subtitle="Các prompt nền từ bài giảng để học viên sao chép, chỉnh sửa và lưu lại thành tài sản cá nhân."
    >
      <Row gutter={[16, 16]}>
        {examples.map((item) => (
          <Col xs={24} md={12} xl={8} key={item.title}>
            <Card className="library-card" title={item.title}>
              <Paragraph>{item.text}</Paragraph>
              <Button
                icon={<Clipboard size={16} />}
                onClick={() => copyText(item.text)}
              >
                Sao chép
              </Button>
            </Card>
          </Col>
        ))}
      </Row>
    </ToolShell>
  );
}

function ToolShell({ icon, title, subtitle, children }) {
  return (
    <section className="tool-shell">
      <div className="tool-heading">
        <div className="tool-icon">{icon}</div>
        <div>
          <Title level={2}>{title}</Title>
          <Paragraph>{subtitle}</Paragraph>
        </div>
      </div>
      {children}
    </section>
  );
}

function App() {
  const [active, setActive] = useStoredState("active-menu", "prompt");
  const [language, setLanguage] = useStoredState("language", "vi");
  const current = {
    prompt: <PromptBuilder language={language} />,
    workflow: <WorkflowPlannerChapter3 language={language} />,
    creative: <CreativeTool language={language} />,
    research: <ResearchVerifier language={language} />,
    analytics: <AnalyticsTool language={language} />,
    agent: <AgentDesigner language={language} />,
    library: <PromptLibrary language={language} />,
  }[active];

  useEffect(() => {
    if (language !== "en") return;

    const frameId = window.requestAnimationFrame(() => {
      const root = document.getElementById("root");
      if (root) applyEnglishInterface(root);
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [language, active]);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1677ff",
          borderRadius: 8,
          fontFamily: "Inter, Segoe UI, Arial, sans-serif",
        },
        components: {
          Card: { headerFontSize: 16 },
          Button: { controlHeight: 38 },
        },
      }}
    >
      <AntApp>
        <Layout className="app-layout" key={language}>
          <Sider
            className="sidebar"
            width={264}
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="brand">
              <div className="brand-mark">
                <img src="/logo-dtc.jpg" alt="DTC" />
              </div>
              <div>
                <Text strong>Trung tâm Chuyển đổi số</Text>
                <span>AI Practice Toolkit</span>
              </div>
            </div>
            <Menu
              mode="inline"
              selectedKeys={[active]}
              items={menuItems}
              onClick={({ key }) => setActive(key)}
            />
          </Sider>
          <Layout>
            <Header className="topbar">
              <Space wrap>
                <Switch
                  checked={language === "en"}
                  checkedChildren="EN"
                  unCheckedChildren="VI"
                  onChange={(checked) => setLanguage(checked ? "en" : "vi")}
                />
                <Tag icon={<CheckCircle2 size={14} />} color="blue">
                  AI First
                </Tag>
                <Tag color="green">Prompt Framework</Tag>
                <Tag color="gold">Verification</Tag>
              </Space>
            </Header>
            <Content className="content">
              <div className="intro-band">
                <div>
                  <Title level={1}>Bộ công cụ thực hành AI cơ bản</Title>
                </div>
              </div>
              <Divider />
              {current}
            </Content>
          </Layout>
        </Layout>
      </AntApp>
    </ConfigProvider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
