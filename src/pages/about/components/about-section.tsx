type SectionProps = {
  title: string
  content: string
  level: 1 | 2
}

const AboutSection = ({ title, content, level }: SectionProps) => {
  const headerStyles = level === 1 
    ? "text-2xl font-bold mb-4 ml-0" 
    : "text-lg font-semibold mb-4 ml-4"
    
  const textStyles = level === 1
    ? "text-gray-300 leading-relaxed text-lg ml-0"
    : "text-gray-300 leading-relaxed text-base ml-8"
    
  return (
    <section className="mb-12">
      <h3 className={headerStyles}>{title}</h3>
      <p className={textStyles}>
        {content}
      </p>
    </section>
  )
}

export default AboutSection