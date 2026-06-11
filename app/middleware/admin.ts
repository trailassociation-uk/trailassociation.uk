export default defineNuxtRouteMiddleware(() => {
  const { user } = useUserSession();
  if (!user.value) {
    return navigateTo("/login", { replace: true });
  }

  const association = useAssociation();
  const membership = useMembership();
  if (!association.value || membership.value?.role !== "admin") {
    return navigateTo("/", { replace: true });
  }
});
