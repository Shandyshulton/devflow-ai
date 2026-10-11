# Product Requirements Document (PRD)

## DevFlow AI: Intelligent Developer Workspace for AI-Assisted Project Management

**Project Track:** IT Track — AI Agent  
**Product Type:** Web Application Prototype  
**Document Version:** 1.0

---

## 1. Product Overview

DevFlow AI adalah aplikasi web yang dirancang untuk membantu software developer mengelola aktivitas pengembangan software melalui satu dashboard terpusat. Aplikasi ini menyediakan fitur pengelolaan task, pemecahan requirement menjadi pekerjaan yang lebih kecil, pelacakan bug, pemantauan progres proyek, dan AI Assistant untuk membantu perencanaan pekerjaan.

Project ini bertujuan mendemonstrasikan bagaimana konsep AI Agent dapat diterapkan dalam workflow pengembangan software. Prototype awal menggunakan HTML5, CSS3, dan vanilla JavaScript, dengan pendekatan implementasi yang sederhana dan tanpa ketergantungan pada backend atau API eksternal.

## 2. Problem Statement

Dalam proses pengembangan software, developer perlu mengelola berbagai aktivitas, seperti memahami requirement, menyusun task, menentukan prioritas pekerjaan, melacak bug, dan memantau progres proyek. Ketika informasi tersebut tersebar di berbagai catatan atau tools, developer dapat mengalami kesulitan dalam memperoleh gambaran menyeluruh mengenai kondisi proyek.

Developer pemula dan mahasiswa IT juga dapat mengalami kesulitan dalam mengubah requirement yang masih umum menjadi task yang terstruktur dan menentukan langkah pengerjaan yang tepat.

Permasalahan tersebut dapat menyebabkan pekerjaan kurang terorganisasi, prioritas tidak jelas, dan progres proyek sulit dipantau. Karena itu, dibutuhkan pendekatan yang membantu developer mengelola informasi proyek secara terstruktur dan memperoleh rekomendasi untuk mendukung perencanaan pekerjaan.

## 3. Target Users

### 3.1 Primary Users

**Software Developer**
- Membutuhkan gambaran progres proyek yang mudah dipahami.
- Perlu mengelola task dan bug secara terstruktur.
- Membutuhkan bantuan untuk menentukan prioritas pekerjaan.

**Junior Developer**
- Membutuhkan panduan untuk memecah requirement menjadi task.
- Memerlukan gambaran langkah pengerjaan yang lebih sistematis.
- Membutuhkan bantuan dalam memahami prioritas dan status pekerjaan.

**IT Students**
- Membutuhkan workspace sederhana untuk mengelola proyek akademik.
- Perlu memantau task, bug, dan progres proyek.
- Membutuhkan contoh penerapan AI Assistant dalam pengembangan software.

## 4. Product Goals

1. Menyediakan dashboard terpusat untuk memantau kondisi proyek.
2. Mempermudah pengelolaan task berdasarkan status dan prioritas.
3. Membantu pengguna memecah requirement menjadi task yang lebih kecil.
4. Menyediakan tampilan untuk melacak bug dan status penanganannya.
5. Mendemonstrasikan AI Assistant sebagai pendukung perencanaan workflow developer.
6. Menghasilkan prototype yang interaktif, responsif, dan mudah digunakan.

## 5. Functional Requirements

### FR-01: Dashboard Overview

**Description:** Menampilkan ringkasan kondisi proyek.

**Requirements:**
- Menampilkan jumlah seluruh task.
- Menampilkan jumlah task yang selesai.
- Menampilkan jumlah task yang sedang dikerjakan.
- Menampilkan jumlah bug yang belum selesai.
- Menampilkan progres proyek secara visual.

**Acceptance Criteria:**
- Statistik ditampilkan dengan jelas.
- Nilai statistik sesuai dengan data task dan bug yang digunakan.
- Indikator progres berubah ketika status task berubah.

### FR-02: Task Management

**Description:** Memungkinkan pengguna mengelola task pengembangan software.

**Requirements:**
- Menampilkan judul dan deskripsi task.
- Menampilkan status task, seperti To Do, In Progress, dan Done.
- Menampilkan tingkat prioritas task.
- Memungkinkan pengguna menambahkan task.
- Memungkinkan pengguna memperbarui status task.
- Menyediakan filter task berdasarkan status atau prioritas.

**Acceptance Criteria:**
- Task baru muncul dalam daftar setelah ditambahkan.
- Perubahan status ditampilkan pada antarmuka.
- Filter menampilkan task sesuai kriteria yang dipilih.
- Data dashboard diperbarui berdasarkan perubahan task.

### FR-03: Requirement Breakdown

**Description:** Membantu pengguna memecah requirement proyek menjadi task yang lebih terstruktur.

**Requirements:**
- Menyediakan input untuk memasukkan requirement.
- Memproses input menjadi beberapa rekomendasi task.
- Menampilkan rekomendasi dalam bentuk daftar yang mudah dibaca.
- Memberikan validasi ketika input kosong.

**Acceptance Criteria:**
- Pengguna dapat memasukkan requirement.
- Sistem menampilkan daftar rekomendasi task berdasarkan skenario yang disediakan.
- Input kosong ditangani dengan pesan yang jelas.
- Hasil simulasi tidak diklaim sebagai hasil model AI sungguhan.

### FR-04: Bug Tracking

**Description:** Menyediakan tampilan untuk memantau bug proyek.

**Requirements:**
- Menampilkan judul bug dan deskripsi singkat.
- Menampilkan prioritas bug.
- Menampilkan status penanganan bug.
- Menggunakan penanda visual untuk membedakan prioritas dan status.

**Acceptance Criteria:**
- Informasi bug dapat dibaca dengan jelas.
- Prioritas dan status mudah dibedakan.
- Status dan data yang ditampilkan konsisten dengan data yang tersedia.

### FR-05: AI Assistant

**Description:** Menyediakan antarmuka percakapan untuk membantu pengguna merencanakan pekerjaan pengembangan software.

**Requirements:**
- Menyediakan kolom input pesan.
- Menampilkan pesan pengguna dan respons assistant.
- Menyediakan respons untuk skenario perencanaan task.
- Memberikan rekomendasi pemecahan requirement dan prioritas pekerjaan.
- Menangani input kosong.

**Acceptance Criteria:**
- Pengguna dapat mengirim pesan melalui antarmuka.
- Pesan pengguna dan respons ditampilkan dalam percakapan.
- Respons relevan dengan skenario yang didukung prototype.
- Simulasi AI diberi batasan yang jelas.

### FR-06: Project Progress

**Description:** Menampilkan perkembangan penyelesaian task proyek.

**Requirements:**
- Menghitung progres berdasarkan task yang selesai dan jumlah seluruh task.
- Menampilkan persentase progres.
- Memperbarui progres ketika status task berubah.

**Acceptance Criteria:**
- Persentase progres sesuai dengan perhitungan task selesai dibagi total task.
- Sistem menangani kondisi ketika belum ada task.
- Progres tidak melebihi 100%.

### FR-07: Navigation

**Description:** Memudahkan pengguna berpindah antarbagian aplikasi.

**Requirements:**
- Menyediakan navigasi untuk Dashboard, Tasks, Bug Tracking, dan AI Assistant.
- Menampilkan bagian yang sedang aktif.
- Memastikan kontrol navigasi dapat digunakan.

**Acceptance Criteria:**
- Pengguna dapat mengakses bagian utama melalui navigasi.
- Navigasi aktif terlihat jelas.
- Tidak terdapat tombol navigasi yang tidak memiliki fungsi.

## 6. User Flows

### Flow A: Memantau Progres Proyek

1. Pengguna membuka DevFlow AI.
2. Sistem menampilkan ringkasan task, bug, dan progres proyek.
3. Pengguna memilih bagian Tasks untuk melihat detail pekerjaan.
4. Pengguna memperbarui status task.
5. Dashboard memperbarui statistik dan progres berdasarkan perubahan tersebut.

### Flow B: Memecah Requirement

1. Pengguna membuka fitur Requirement Breakdown.
2. Pengguna memasukkan requirement proyek.
3. Sistem memvalidasi input.
4. Sistem menghasilkan rekomendasi task menggunakan mekanisme simulasi.
5. Pengguna meninjau hasil rekomendasi.

### Flow C: Menggunakan AI Assistant

1. Pengguna membuka AI Assistant.
2. Pengguna memasukkan pertanyaan mengenai task atau perencanaan proyek.
3. Sistem menampilkan respons sesuai skenario yang didukung.
4. Pengguna menggunakan respons sebagai referensi untuk menentukan langkah berikutnya.

### Flow D: Melacak Bug

1. Pengguna membuka Bug Tracking.
2. Sistem menampilkan daftar bug beserta prioritas dan statusnya.
3. Pengguna meninjau bug yang perlu ditangani.
4. Pengguna menggunakan informasi tersebut untuk menentukan prioritas pekerjaan.

## 7. Non-Functional Requirements

### 7.1 Usability
Antarmuka harus mudah dipahami, dengan navigasi jelas, hierarki informasi yang baik, dan feedback untuk interaksi pengguna.

### 7.2 Responsive Design
Layout harus menyesuaikan ukuran layar desktop, tablet, dan mobile.

### 7.3 Accessibility
- Menggunakan elemen HTML semantik.
- Menyediakan label yang jelas untuk input.
- Mendukung navigasi keyboard.
- Menyediakan indikator fokus yang terlihat.
- Menggunakan kontras teks yang memadai.
- Tidak mengandalkan warna saja untuk menyampaikan status.

### 7.4 Performance
- Menghindari dependensi yang tidak diperlukan.
- Menghindari operasi JavaScript yang tidak efisien.
- Memastikan interaksi utama berjalan tanpa jeda yang mengganggu.

### 7.5 Maintainability
Kode harus terstruktur, konsisten, mudah dibaca, dan dapat dikembangkan lebih lanjut.

### 7.6 Reliability
Validasi input, kondisi data kosong, dan interaksi utama harus ditangani dengan baik.

## 8. Technical Constraints

- HTML5 untuk struktur aplikasi.
- CSS3 untuk styling dan layout.
- Vanilla JavaScript untuk interaksi dan pengelolaan data.
- Tidak menggunakan frontend framework.
- Tidak menggunakan CSS framework.
- Tidak menggunakan library eksternal atau third-party extensions.
- Tidak menggunakan backend atau API eksternal pada prototype awal.
- Data awal dapat menggunakan sample data lokal.
- Struktur implementasi mengikuti kebutuhan prototype dan dapat dikembangkan lebih lanjut.

## 9. AI Agent Scope and Limitations

Pada prototype awal, AI Assistant dan Requirement Breakdown dapat menggunakan predefined responses atau aturan JavaScript sederhana untuk mendemonstrasikan alur interaksi.

Cakupan prototype meliputi:
- Simulasi bantuan perencanaan task.
- Simulasi pemecahan requirement.
- Simulasi rekomendasi prioritas pekerjaan.
- Antarmuka percakapan yang interaktif.

Prototype ini belum dianggap menggunakan AI sungguhan kecuali model AI telah diintegrasikan dan integrasinya benar-benar berfungsi.

Integrasi model AI, autentikasi pengguna, kolaborasi real-time, sinkronisasi dengan repository, dan penyimpanan berbasis server berada di luar cakupan awal.

## 10. Acceptance Criteria and Success Metrics

Prototype dinyatakan memenuhi kebutuhan dasar apabila:

1. Semua bagian utama dapat diakses melalui navigasi.
2. Dashboard menampilkan statistik yang konsisten dengan data.
3. Pengguna dapat menambahkan task, memperbarui status, dan menggunakan filter.
4. Requirement Breakdown menerima input dan menghasilkan rekomendasi simulatif.
5. AI Assistant menerima pesan dan menampilkan respons simulatif.
6. Bug Tracking menampilkan informasi bug dengan prioritas dan status.
7. Progres proyek dihitung berdasarkan data task.
8. Input kosong dan kondisi tanpa data ditangani dengan baik.
9. Layout dapat digunakan pada desktop dan mobile.
10. Fitur utama berjalan tanpa error JavaScript yang mengganggu.
11. Implementasi mematuhi seluruh batasan teknologi.
12. Fitur yang belum selesai atau belum diuji didokumentasikan secara transparan.

Pengujian dilakukan melalui pemeriksaan manual terhadap user flow dan validasi teknis terhadap kode serta perilaku aplikasi.

## 11. Project Scope and Deliverables

### In Scope
- Dashboard overview.
- Task management.
- Requirement Breakdown.
- Bug Tracking.
- AI Assistant simulatif.
- Project progress.
- Navigasi antarbagiannya.
- Responsive layout dan validasi interaksi.

### Out of Scope
- Integrasi model AI eksternal.
- Backend dan database server.
- Autentikasi dan otorisasi.
- Kolaborasi real-time.
- Integrasi repository GitHub.
- Deployment dan monitoring produksi.

### Deliverables
1. Source code aplikasi berbasis HTML, CSS, dan JavaScript.
2. Dokumen `PRD.md`.
3. Implementasi fitur sesuai cakupan PRD.
4. Bukti pengujian dan hasil evaluasi iterasi prompt.
5. Dokumentasi keterbatasan prototype.

## 12. Assumptions

- Prototype ditujukan untuk demonstrasi capstone, bukan penggunaan produksi.
- Pengguna utama adalah developer individu, junior developer, dan mahasiswa IT.
- Data awal menggunakan sample data lokal.
- Fitur AI pada tahap awal dapat disimulasikan.
- Implementasi dan pengujian akan dilakukan secara bertahap melalui prompt iteratif di IBM Bob.

PRD ini menjadi acuan kebutuhan produk untuk Iterasi Prompt 1, Iterasi Prompt 2, dan Iterasi Prompt 3. Perubahan cakupan harus didokumentasikan dan disesuaikan dengan tujuan capstone.