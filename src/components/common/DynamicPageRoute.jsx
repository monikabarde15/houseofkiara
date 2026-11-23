import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { usePageContent } from "../../hooks/usePageContent";
import DynamicServicePage from "./DynamicServicePage";
import PageNotFound from "../../pages/PageNotFound";

export function DynamicPageRoute({ slug, fallback }) {
  const location = useLocation();
  const isImportStatic =
    new URLSearchParams(location.search).get("import_static") === "1";

  const { pageData, loading } = usePageContent(isImportStatic ? "" : slug);

  if (isImportStatic) {
    return fallback;
  }

  if (loading && !pageData) {
    return <div style={{ minHeight: "65vh", background: "#FAF7F2" }} />;
  }

  if (pageData?.settings?.dynamicPage?.published === true) {
    return <DynamicServicePage slug={slug} pageData={pageData} />;
  }

  return fallback;
}

export function CustomSlugDynamicPage() {
  const { slug } = useParams();
  const cleanSlug = String(slug || "").trim().toLowerCase();
  const isReserved =
    !cleanSlug || cleanSlug === "hok_admin" || cleanSlug === "api";
  const { pageData, loading } = usePageContent(
    isReserved ? "" : `/${cleanSlug}`,
  );

  if (isReserved) {
    return <PageNotFound />;
  }

  if (loading && !pageData) {
    return <div style={{ minHeight: "65vh", background: "#FAF7F2" }} />;
  }

  if (pageData?.settings?.dynamicPage?.published === true) {
    return <DynamicServicePage slug={cleanSlug} pageData={pageData} />;
  }

  return <PageNotFound />;
}
