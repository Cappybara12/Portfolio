import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Akshay Kumar Sharma - Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      color: #1e293b;
      line-height: 1.35;
      font-size: 10.5px;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    
    .container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 5px;
    }
    
    header {
      text-align: center;
      margin-bottom: 12px;
    }
    
    h1 {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      letter-spacing: -0.02em;
      margin-bottom: 4px;
    }
    
    .contact-info {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      color: #64748b;
      font-size: 10px;
      font-weight: 500;
    }
    
    .contact-info a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.15s ease;
    }
    
    .contact-info a:hover {
      color: #4f46e5;
    }
    
    .contact-info span.divider {
      color: #cbd5e1;
    }

    section {
      margin-bottom: 10px;
    }
    
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #4f46e5;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 2px;
      margin-bottom: 6px;
    }
    
    .impact-item {
      margin-bottom: 4px;
    }
    
    .impact-item strong {
      color: #0f172a;
      font-weight: 600;
    }

    /* Skills */
    .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    
    .skills-row {
      display: flex;
      align-items: baseline;
    }
    
    .skills-category {
      font-weight: 600;
      color: #0f172a;
      width: 140px;
      flex-shrink: 0;
    }
    
    .skills-list {
      color: #334155;
    }

    /* Experience & Projects */
    .exp-item {
      margin-bottom: 8px;
    }
    
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    
    .exp-title {
      font-size: 11px;
      font-weight: 700;
      color: #0f172a;
    }
    
    .exp-date {
      font-size: 9.5px;
      font-weight: 500;
      color: #64748b;
    }
    
    .exp-role {
      font-size: 10px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 3px;
    }
    
    ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    li {
      position: relative;
      padding-left: 10px;
      margin-bottom: 2px;
      color: #334155;
    }
    
    li::before {
      content: "•";
      position: absolute;
      left: 0;
      color: #cbd5e1;
    }
    
    /* Education & Certs Split layout */
    .split-layout {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 15px;
    }
    
    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .cert-item, .edu-item {
      margin-bottom: 4px;
    }
    
    .cert-title, .edu-title {
      font-weight: 600;
      color: #0f172a;
    }

    @media print {
      body {
        background-color: #ffffff;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      @page {
        size: A4;
        margin: 12mm 14mm 10mm 14mm;
      }
      .container {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>AKSHAY KUMAR SHARMA</h1>
      <div class="contact-info">
        <a href="mailto:akshayne912@gmail.com">akshayne912@gmail.com</a>
        <span class="divider">|</span>
        <a href="https://linkedin.com/in/akshay-kumar-sharma" target="_blank">linkedin.com/in/akshay-kumar-sharma</a>
        <span class="divider">|</span>
        <a href="https://github.com/Cappybara12" target="_blank">github.com/Cappybara12</a>
        <span class="divider">|</span>
        <a href="https://instagram.com/tech.andtry" target="_blank">@akshayat.it</a>
        <span class="divider">|</span>
        <span>+91-9212125315</span>
      </div>
    </header>

    <!-- Community Impact -->
    <section>
      <div class="section-title">Community Impact</div>
      <div class="impact-item">
        <strong>Developer Community:</strong> Founded GeekRoom, scaling to 70,000+ members across 20+ college chapters pan-India through hackathons, workshops, and mentorship programs.
      </div>
      <div class="impact-item">
        <strong>Content & Events:</strong> 3,000+ LinkedIn followers; runs <em>tech.andtry</em> Instagram for developers. Organised Code Kshetra, India’s largest student hackathon (400+ participants, 17K+ registrations).
      </div>
    </section>

    <!-- Skills -->
    <section>
      <div class="section-title">Skills</div>
      <div class="skills-grid">
        <div class="skills-row">
          <span class="skills-category">DevRel & Advocacy:</span>
          <span class="skills-list">Community Building, Technical Content Strategy, Open Source Programs, Video Production, SEO</span>
        </div>
        <div class="skills-row">
          <span class="skills-category">Observability & AI:</span>
          <span class="skills-list">OpenTelemetry (OTel), SigNoz, Apache Iceberg, LangChain, Ollama, TensorFlow</span>
        </div>
        <div class="skills-row">
          <span class="skills-category">Engineering:</span>
          <span class="skills-list">Python, TypeScript, JavaScript, Go, MERN Stack, Next.js, Firebase</span>
        </div>
        <div class="skills-row">
          <span class="skills-category">Cloud & DevOps:</span>
          <span class="skills-list">AWS, Azure, Docker, Kubernetes, Terraform, CircleCI, EKS</span>
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section>
      <div class="section-title">Experience</div>
      
      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-title">SigNoz <span style="font-weight: 500; color: #475569;">— Developer Relations Engineer</span></span>
          <span class="exp-date">March 2026 – Present</span>
        </div>
        <ul>
          <li>Piloted YouTube as a developer education channel: produced 10+ long-form and short-form videos on SigNoz product workflows and OpenTelemetry concepts (collection agents, AI observability) to grow impressions organically.</li>
          <li>Defined content distribution workflow: published contextual video summaries on Reddit targeting developers evaluating observability tools, increasing organic traffic to product content.</li>
          <li>Reduced documentation discovery friction by backlinking video walkthroughs into relevant docs pages, shortening time-to-value for new users.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-title">Datazip <span style="font-weight: 500; color: #475569;">— Developer Relations Engineer (OLAKE, open-source lakehouse)</span></span>
          <span class="exp-date">July 2025 – February 2026</span>
        </div>
        <ul>
          <li>Authored 10+ technical blogs on OLAKE accumulating 100,000+ cumulative impressions, increasing developer adoption and organic search ranking by 30%.</li>
          <li>Represented OLAKE at Apache Iceberg meetups and conducted India’s first official Apache Iceberg meetup; ran monthly webinars and workshops to maintain community engagement.</li>
          <li>Coordinated Hacktoberfest and Google Summer of Code programs, growing OLAKE’s open-source contributor base.</li>
          <li>Executed SEO strategy across internal linking, content optimisation, and newsletter partnerships, lifting site performance by 30%.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-title">GeekRoom <span style="font-weight: 500; color: #475569;">— Founding Member & Community Lead</span></span>
          <span class="exp-date">April 2022 – Present</span>
        </div>
        <ul>
          <li>Founded and scaled a pan-India developer community to 70,000+ members with 20+ chapters through hackathons, workshops, and technical sessions.</li>
          <li>Led Code Kshetra and Code Cubicle partnering with Microsoft, Mastercard, Vapi and Groq to connect students with real-world engineering opportunities.</li>
        </ul>
      </div>

      <div class="grid-2col">
        <div class="exp-item">
          <div class="exp-header">
            <span class="exp-title">TensorStax <span style="font-weight: 500; color: #475569;">— Software Engineer</span></span>
            <span class="exp-date">October 2024</span>
          </div>
          <ul>
            <li>Configured Apache Superset dashboards to 80%+ accuracy; automated ML deployment pipeline on Azure; platform acquired by Snowflake.</li>
          </ul>
        </div>
        <div class="exp-item">
          <div class="exp-header">
            <span class="exp-title">The Misty Interactive Studios <span style="font-weight: 500; color: #475569;">— Software Engineer</span></span>
            <span class="exp-date">February – June 2025</span>
          </div>
          <ul>
            <li>Shipped core features for Nonilion.com, 3,000+ users, 5th Product of the Day on Product Hunt; managed Docker deployments on GCP.</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Projects -->
    <section>
      <div class="section-title">Projects</div>
      
      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-title">Nonilion <span style="font-weight: 500; color: #475569;">— Immersive Virtual Meeting Platform</span></span>
          <span class="exp-date">Next.js · LiveKit · GCP · Docker</span>
        </div>
        <ul>
          <li>Built virtual meeting platform with sub-meeting spaces, 3D avatars, and spatial audio using LiveKit for real-time WebRTC communication; 3,000+ users, ranked 5th Product of the Day on Product Hunt.</li>
          <li>Integrated Jira SDK directly into the platform for in-meeting task management; engineered sub-room architecture enabling parallel breakout sessions within a single meeting context.</li>
        </ul>
      </div>

      <div class="exp-item">
        <div class="exp-header">
          <span class="exp-title">BalencAI <span style="font-weight: 500; color: #475569;">— Finance Document Automation via AI Agents</span></span>
          <span class="exp-date">LangChain · Mastra · RAG · OpenAI</span>
        </div>
        <ul>
          <li>Automated extraction of financial fields from PDFs (balance sheets, P&L) using Mastra agentic workflows; applied chunking and field-mapping strategies for scalable document ingestion and structured output.</li>
          <li>Integrated RAG pipeline with vector embeddings for natural language querying of financial documents, enabling contextual LLM-driven financial insights.</li>
        </ul>
      </div>
    </section>

    <!-- Education & Achievements -->
    <section>
      <div class="grid-2col">
        <div>
          <div class="section-title">Certifications & Achievements</div>
          <div class="cert-item">
            <span class="cert-title">AWS:</span> Developer Associate (DVA-C02, Score: 708) & Cloud Quest
          </div>
          <div class="cert-item">
            <span class="cert-title">Azure:</span> AZ-900, AI-900 <span style="font-weight: 500; color: #475569;">|</span> Microsoft Learn Student Ambassador Beta
          </div>
          <div class="cert-item">
            <span class="cert-title">Achievements:</span> 2x hackathon winner (100+ teams); mentored 10+ hackathons; judged 5+ events; led India’s largest student hackathon (400+ participants, 17K+ registrations)
          </div>
        </div>
        <div>
          <div class="section-title">Education</div>
          <div class="edu-item">
            <div style="display: flex; justify-content: space-between; font-weight: 600; color: #0f172a;">
              <span>B.Tech in Computer Science</span>
              <span>2022 – 2026</span>
            </div>
            <div style="color: #475569; font-weight: 500; margin-top: 2px;">GGSIPU, Delhi</div>
            <div style="color: #334155; margin-top: 4px;">CGPA: 8.3/10</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</body>
</html>
"""

# Write HTML content to temporary file
temp_html = "temp_resume.html"
with open(temp_html, "w") as f:
    f.write(html_content)

print("HTML file written.")

# Create public directory if not exists
os.makedirs("public", exist_ok=True)
pdf_path = "public/resume.pdf"

print("Compiling HTML to PDF using Google Chrome...")
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

try:
    subprocess.run([
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--no-pdf-header-footer",
        f"--print-to-pdf={pdf_path}",
        temp_html
    ], check=True)
    print(f"Successfully generated PDF: {pdf_path}")
except Exception as e:
    print(f"Error compiling PDF: {e}")
finally:
    if os.path.exists(temp_html):
        os.remove(temp_html)
        print("Cleaned up temporary HTML file.")
