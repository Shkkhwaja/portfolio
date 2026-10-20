export default function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data]
  return (
    <>
      {items.map((d, i) => (
        <script
          key={i}
          type="application/ld+json"
          // JSON.stringify output is safe; escape "<" so "</script>" can never appear in the payload
          dangerouslySetInnerHTML={{ __html: JSON.stringify(d).replace(/</g, '\u003c') }}
        />
      ))}
    </>
  )
}
