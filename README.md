🚀 Dynamic Form Builder – Node.js Developer Assignment

A full-stack dynamic form builder system where an admin can create forms and fields dynamically, and users can submit responses that are fully validated and stored in a MongoDB database.

This submission includes:

✔ Backend (Node.js + Express + MongoDB)

✔ Admin CRUD for Forms & Fields

✔ Dynamic public form rendering (API)

✔ Form submission with validation

✔ Admin dashboard APIs

✔ Export submissions to Excel (Bonus)

✔ Minimal Next.js admin UI (Bonus)

✔ Clean directory structure + validation + authentication

📌 Project Overview

This application allows:

👨‍💼 Admin Features

Create / edit / delete forms

Add / edit / delete fields inside form

Supported field types:

text, textarea, number, email, date

checkbox, radio, select

Options support for:

radio, checkbox, select

Nested fields on radio/select conditions

Field validation rules:

required

min / max

regex

Field ordering (drag/drop or numeric order)

View all submissions of a form

Export submissions in Excel (.xlsx)

🧑‍💻 Public (User) Features

List active forms

Fetch & render form dynamically based on field definitions

Submit form → server-side validation

Store submissions in MongoDB with:

formId

answers

submittedAt

IP address (optional)

🛠️ Tech Stack
Backend

Node.js (Express.js)

MongoDB (Mongoose)

ExcelJS (Export file)

Joi / Custom validators

JWT / Basic Token Auth

bcrypt

CORS

Frontend (Admin UI)

Next.js 15 (App Router)

TailwindCSS

Fetch API / server actions

⚙️ Installation & Setup
Backend : git clone https://github.com/mahendrasooryavanshi/Dynamic-Form-Builder.git
FrontEnd : git clone https://github.com/mahendrasooryavanshi/form-builder-app-frontend.git
npm install
npm run dev # for local dev

🔐 Admin Authentication

Admin routes require:

Authorization: Bearer <ADMIN_TOKEN>

Set ADMIN_TOKEN in .env.

📡 API Endpoints
✔ Admin: Forms
Method Endpoint Description
POST /api/admin/forms Create form
PUT /api/admin/forms/:id Update form
DELETE /api/admin/forms/:id Delete form
GET /api/admin/forms List all forms
GET /api/admin/forms/:id Get form by ID
✔ Admin: Fields
Method Endpoint Description
POST /api/admin/forms/:id/fields Add field
PUT /api/admin/forms/:id/fields/:fieldId Update field
DELETE /api/admin/forms/:id/fields/:fieldId Delete field
✔ Submissions
Method Endpoint Description
GET /api/admin/forms/:id/submissions List submissions
GET /api/admin/forms/:id/submissions/export Export Excel file
POST /api/forms/:id/submissions Submit user response
✔ Public
Method Endpoint Description
GET /api/forms List forms
GET /api/forms/:id Get form definition
🧪 Validation Logic

Each field supports:

required

min

max

regex

options (for select/radio/checkbox)

type checking

📤 Excel Export (Bonus)
Endpoint: GET /api/admin/forms/:id/submissions/export

.env file will be
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/dynamic_form_builder_app_db
ADMIN_USER=admin
ADMIN_PASS=admin@123
