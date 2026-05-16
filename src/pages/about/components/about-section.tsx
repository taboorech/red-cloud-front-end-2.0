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
    ? "text-app-text-soft leading-relaxed text-lg ml-0"
    : "text-app-text-soft leading-relaxed text-base ml-8"
    
  return (
    <section className="mb-8">
      <h3 className={headerStyles}>{title}</h3>
      <p className={textStyles}>
        {content}
      </p>
    </section>
  )
}

export default AboutSection