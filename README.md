# AI Practice Toolkit

Website frontend hỗ trợ học viên nontech thực hành các kỹ năng trong khóa AI cơ bản:

- Tạo prompt rõ vai trò, bối cảnh, định dạng và ràng buộc.
- Lập workflow ứng dụng AI theo Preparation, Generation, Verification, Refinement.
- Tạo prompt viết nội dung theo AIDA.
- Kiểm chứng nguồn, hạn chế hallucination và đánh giá độ tin cậy.
- Tạo prompt phân tích dữ liệu theo khung ANALYTICA.
- Thiết kế instruction và cấu hình mẫu cho AI Agent.

## Chạy local

```bash
npm install
npm run dev
```

Nếu thư mục dự án trên Windows có ký tự đặc biệt trong đường dẫn, script đã gọi trực tiếp Vite qua `node ./node_modules/vite/bin/vite.js` để tránh lỗi `.cmd`.

## Build production

```bash
npm run build
```

Nếu đang mở preview local và Windows khóa file trong `dist`, hãy dừng preview hoặc dùng:

```bash
npm run build -- --emptyOutDir false
```

## Deploy Vercel

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
