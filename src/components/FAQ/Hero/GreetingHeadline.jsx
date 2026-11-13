export default function GreetingHeadline({ getVal }) {
  const greeting = getVal ? getVal("faq_greeting", "Hello, we're so glad you're here") : "Hello, we're so glad you're here";
  const heading = getVal ? getVal("faq_heading", null) : null;
  return (
    <div className="ch-intro">
      <p className="ch-hello enter">{greeting}</p>
      <h1 className="ch-h1 enter e2">
        {heading ? heading : <>What's on <em>your mind?</em></>}
      </h1>
    </div>
  );
}
