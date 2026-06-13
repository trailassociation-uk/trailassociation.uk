export default defineNuxtRouteMiddleware((to) => {
  const { user } = useUserSession();
  if (!user.value) {
    return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  }
});
