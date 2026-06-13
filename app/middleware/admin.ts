export default defineNuxtRouteMiddleware((to) => {
  const { user } = useUserSession();
  if (!user.value) {
    return navigateTo(`/login?next=${encodeURIComponent(to.fullPath)}`, {
      replace: true,
    });
  }

  const association = useAssociation();
  const membership = useMembership();
  if (!association.value || membership.value?.role !== "admin") {
    return navigateTo("/", { replace: true });
  }
});
