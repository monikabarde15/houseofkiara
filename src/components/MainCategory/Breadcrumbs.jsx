// src\components\MainCategory\Breadcrumbs.jsx
function Breadcrumbs({
  home = "Home",
  parent,
  current,
}) {
  return (
    <div className="breadcrumb">
      <span className="link">{home}</span>

      <span className="separator">›</span>

      <span className="link">{parent}</span>

      <span className="separator">›</span>

      <span className="current">
        {current}
      </span>
    </div>
  );
}

export default Breadcrumbs;