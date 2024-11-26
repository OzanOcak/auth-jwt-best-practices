import { useUserName } from "@/hooks/useProfile";

import Layout from "@/components/custom/layout";
import { Pending } from "@/components/custom/isPending";
import { Erroring } from "@/components/custom/isError";

export default function ProfilePage() {
  const { data: userData, isPending, isError, error } = useUserName();

  if (isPending) return <Pending />;
  if (isError) return <Erroring />;

  return (
    <Layout>
      <p>Sorry!, not so many things to do for you</p>
    </Layout>
  );
}
