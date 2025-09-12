Project Reminder Frontend (Login/Index/Staff)

✅ API_URL sudah diset ke:
https://script.google.com/macros/s/AKfycbz_kRUiVrO0W-7pab0C5_L6o0w4VqnyuK06XsZlP8tU-gksQ37BNj5008NUr7X_JUYu7Q/exec

File:
- auth.js
- login.html
- index.html
- staff.html

Catatan:
- login.html akan redirect ke index.html (Manager) atau staff.html (Staff) setelah login.
- index.html dijaga requireAuth("manager")
- staff.html dijaga requireAuth("staff")
- Tombol logout (id=btn-logout) sudah di-bind ke doLogout().
