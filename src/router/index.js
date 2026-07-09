import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { hideNavbar: true, guestOnly: true },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/Login.vue"),
      meta: { hideNavbar: true, guestOnly: true },
    },
    {
      path: "/admin",
      component: () => import("../layouts/AdminLayout.vue"),
      meta: { requiresAuth: true, role: "admin", hideNavbar: true },
      children: [
        {
          path: "dashboard",
          name: "admin.dashboard",
          component: () => import("../views/admin/Dashboard.vue"),
        },
        {
          path: "students",
          name: "students.index",
          component: () => import("../views/admin/students/Index.vue"),
        },

        {
          path: "students/edit/:id",
          name: "students.edit",
          component: () => import("../views/admin/students/Edit.vue"),
        },
        {
          path: "classrooms",
          name: "classrooms.index",
          component: () => import("../views/admin/classrooms/Index.vue"),
        },
        {
          path: "fees",
          name: "fees.index",
          component: () => import("../views/admin/fees/index.vue"),
        },
        {
          path: "bills",
          name: "bills.index",
          component: () => import("../views/admin/bills/Index.vue"),
        },
      ],
    },
    {
      path: "/student",
      component: () => import("../views/student/Layout.vue"),
      meta: { requiresAuth: true, role: "student", hideNavbar: true },
      children: [
        {
          path: "dashboard",
          name: "student.dashboard",
          component: () =>
            import("../views/student/Dashboard.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!token;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "login" });
  }
  if (to.meta.guestOnly && isAuthenticated) {
    if (user?.role === "admin") return next({ name: "admin.dashboard" });
    if (user?.role === "student") return next({ name: "student.dashboard" });
  }
  if (to.meta.role && user && to.meta.role !== user.role) {
    if (user.role === "admin") return next({ name: "admin.dashboard" });
    if (user.role === "student") return next({ name: "student.dashboard" });
  }

  next();
});

export default router;
