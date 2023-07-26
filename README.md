# NestJS Dasar


## 1. Apa itu NestJs ?
NestJS adalah sebuah framework untuk membuat aplikasi server-side (back-end) dengan menggunakan bahasa pemrograman TypeScript, yang dibangun di atas platform Node.js.

NestJS memiliki konsep arsitektur yang terinspirasi dari Angular, yaitu menggunakan Dependency Injection, module, dan controller. NestJS juga menyediakan fitur-fitur yang berguna untuk memudahkan pengembangan aplikasi seperti middleware, pipes, guards, interceptors, dan lain-lain. Selain itu, NestJS juga dapat digunakan dengan berbagai database seperti MySQL, PostgreSQL, MongoDB, dan sebagainya.

![Alt text](https://photos.google.com/photo/AF1QipMvlJotNE_755VTZ_QxNTP2OhsK9I5mYXc8gbND)


Dokumentasi resmi : https://nestjs.com/


## 2. Instalasi Project NestJS
Sebelum memulai mempelajari NestJs ada beberapa tools yang harus dipersiapnkan

a. Instalasi nodejs dan npm
```tsx

node -v
npm -v

```

b. Instalasi Text Editor (Visual Code Studio)
c. Instalasi Nest CLI
```tsx
npm install -g @nestjs/cli
nest --help

```

![Alt text](image-1.png)

c. Instalasi Postman
Postman adalah aplikasi yang digunakan untuk pengujian api / service pada BE
Download https://www.postman.com/downloads/

![Alt text](image-2.png)


## 3. Buat Project NestJS
Pertama Kali untuk membuat Project NestJS , kita akan membuat folder baru kemudian kita akan buka dengan Visual Code Studio
```tsx
ihsanabuhanifah@ihsanabnifahMBP FullstackDev % nest new backend-nestjs
⚡  We will scaffold your app in a few seconds..

CREATE backend-nestjs/.eslintrc.js (665 bytes)
CREATE backend-nestjs/.prettierrc (51 bytes)
CREATE backend-nestjs/README.md (3340 bytes)
CREATE backend-nestjs/nest-cli.json (118 bytes)
CREATE backend-nestjs/package.json (1999 bytes)
CREATE backend-nestjs/tsconfig.build.json (97 bytes)
CREATE backend-nestjs/tsconfig.json (546 bytes)
CREATE backend-nestjs/src/app.controller.spec.ts (617 bytes)
CREATE backend-nestjs/src/app.controller.ts (274 bytes)
CREATE backend-nestjs/src/app.module.ts (249 bytes)
CREATE backend-nestjs/src/app.service.ts (142 bytes)
CREATE backend-nestjs/src/main.ts (208 bytes)
CREATE backend-nestjs/test/app.e2e-spec.ts (630 bytes)
CREATE backend-nestjs/test/jest-e2e.json (183 bytes)

? Which package manager would you ❤️  to use? npm
▹▸▹▹▹ Installation in progress... ☕
```
kita tinggal penunggu sampai proses intalasi selesai. 
Setelah selesai proses instalasi, kemudian jalankann npm run dev:start untuk memulai proses intalasi

```tsx
npm run dev:start
```

![Alt text](image-3.png)

Apabila dibuka pada browser maka akan tampil sebagai berikut.
![Alt text](image-4.png)
