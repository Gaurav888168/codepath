import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://www.getkodin.com';
const DSA_URL = `${BASE_URL}/dsa`;
const OUTPUT_DIR = path.resolve('scraped_data');
const VISUALIZERS_DIR = path.join(OUTPUT_DIR, 'visualizers');

// Ensure output directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(VISUALIZERS_DIR)) fs.mkdirSync(VISUALIZERS_DIR, { recursive: true });

console.log(`🌐 Fetching main DSA page: ${DSA_URL}...`);

async function fetchUrl(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!response.ok) throw new Error(`HTTP Error ${response.status} for ${url}`);
  return await response.text();
}

async function scrape() {
  try {
    const html = await fetchUrl(DSA_URL);

    // 1. Extract JSON-LD Schemas (FAQ, Course, HowTos)
    const jsonLdMatches = html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi);
    const schemas = [];
    for (const match of jsonLdMatches) {
      try {
        schemas.push(JSON.parse(match[1].trim()));
      } catch (e) {}
    }

    // 2. Extract Embedded topicsData JavaScript object
    let topicsData = {};
    const topicsMatch = html.match(/const topicsData\s*=\s*(\{[\s\S]*?\n\s*\};)/);
    if (topicsMatch) {
      try {
        const cleanedJs = topicsMatch[1].replace(/;\s*$/, '');
        topicsData = eval(`(${cleanedJs})`);
      } catch (err) {
        console.warn('Could not eval topicsData directly, using fallback extraction:', err.message);
      }
    }

    // 3. Extract FAQ & LeetCode QA from Schema
    const faqs = [];
    schemas.forEach(schema => {
      if (schema['@type'] === 'FAQPage' && Array.isArray(schema.mainEntity)) {
        schema.mainEntity.forEach(item => {
          faqs.push({
            question: item.name,
            answer: item.acceptedAnswer?.text || ''
          });
        });
      }
    });

    // 4. Extract HowTo Tutorials
    const tutorials = [];
    schemas.forEach(schema => {
      if (schema['@type'] === 'CollectionPage' && Array.isArray(schema.mainEntity)) {
        schema.mainEntity.forEach(item => {
          if (item['@type'] === 'HowTo') {
            tutorials.push({
              title: item.name,
              description: item.description,
              steps: (item.step || []).map(s => ({ title: s.name, details: s.text }))
            });
          }
        });
      }
    });

    // 5. Gather all visualizer files to download
    const visualizerFiles = new Set();
    Object.values(topicsData).forEach(topic => {
      (topic.problems || []).forEach(p => {
        if (p.visualizer && p.visualizer.endsWith('.html')) {
          visualizerFiles.add(p.visualizer);
        }
      });
    });

    console.log(`\n📦 Discovered:`);
    console.log(` - ${Object.keys(topicsData).length} DSA Topic Categories`);
    console.log(` - ${faqs.length} Interview Q&A / FAQs`);
    console.log(` - ${tutorials.length} LeetCode Step-by-Step Tutorials`);
    console.log(` - ${visualizerFiles.size} Interactive Visualizer HTML Files`);

    // 6. Download all visualizer HTML files
    console.log(`\n📥 Downloading interactive visualizer files...`);
    const downloadedVisualizers = [];
    for (const file of visualizerFiles) {
      const fileUrl = `${BASE_URL}/${file}`;
      try {
        console.log(`  -> Downloading ${file}...`);
        const content = await fetchUrl(fileUrl);
        const savePath = path.join(VISUALIZERS_DIR, file);
        fs.writeFileSync(savePath, content, 'utf-8');
        downloadedVisualizers.push({ file, status: 'SUCCESS', size: content.length });
      } catch (err) {
        console.warn(`  ⚠️ Failed to download ${file}: ${err.message}`);
        downloadedVisualizers.push({ file, status: 'FAILED', error: err.message });
      }
    }

    // 7. Save complete JSON dataset
    const fullDataset = {
      scrapedAt: new Date().toISOString(),
      source: DSA_URL,
      totalTopics: Object.keys(topicsData).length,
      topics: topicsData,
      faqs,
      tutorials,
      visualizerFiles: downloadedVisualizers
    };

    fs.writeFileSync(path.join(OUTPUT_DIR, 'kodin_dsa_data.json'), JSON.stringify(fullDataset, null, 2), 'utf-8');
    console.log(`\n✅ Saved complete JSON dataset to: scraped_data/kodin_dsa_data.json`);

    // 8. Generate Human-Readable Markdown Document
    let md = `# 📚 Kodin DSA Study Material & Problem Reference\n\n`;
    md += `*Scraped from [${DSA_URL}](${DSA_URL}) on ${new Date().toLocaleDateString()}*\n\n---\n\n`;
    
    md += `## 📑 Table of Contents\n\n`;
    Object.entries(topicsData).forEach(([key, topic]) => {
      md += `* [${topic.title}](#${key})\n`;
    });
    md += `* [Interview FAQs & Solutions](#interview-faqs--solutions)\n`;
    md += `* [Step-by-Step Problem Tutorials](#step-by-step-problem-tutorials)\n\n---\n\n`;

    Object.entries(topicsData).forEach(([key, topic]) => {
      md += `### <a id="${key}"></a>📂 ${topic.title}\n\n`;
      md += `| Problem Title | Difficulty | Description | Visualizer |\n`;
      md += `| :--- | :--- | :--- | :--- |\n`;
      (topic.problems || []).forEach(p => {
        const visLink = p.visualizer && p.visualizer !== '#' ? `\`${p.visualizer}\`` : 'N/A';
        md += `| **${p.title}** | \`${p.difficulty.toUpperCase()}\` | ${p.desc} | ${visLink} |\n`;
      });
      md += `\n`;
    });

    md += `\n---\n\n## ❓ Interview FAQs & Solutions\n\n`;
    faqs.forEach((faq, idx) => {
      md += `### ${idx + 1}. ${faq.question}\n\n${faq.answer}\n\n`;
    });

    md += `\n---\n\n## 🛠️ Step-by-Step Problem Tutorials\n\n`;
    tutorials.forEach(tut => {
      md += `### 💡 ${tut.title}\n\n*${tut.description}*\n\n`;
      tut.steps.forEach((s, idx) => {
        md += `* **Step ${idx + 1}: ${s.title}** — ${s.details}\n`;
      });
      md += `\n`;
    });

    fs.writeFileSync(path.join(OUTPUT_DIR, 'kodin_dsa_summary.md'), md, 'utf-8');
    console.log(`✅ Saved markdown study notes to: scraped_data/kodin_dsa_summary.md`);

    console.log(`\n🎉 All study materials and visualizers scraped successfully!`);
  } catch (err) {
    console.error(`❌ Scraping failed:`, err);
  }
}

scrape();
