// Source-level regression tests: every in-page navigation target must resolve
// to a real section id, and the contact CTA must be a working anchor.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..', 'src');
const read = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

const SECTION_FILES = {
  about: 'components/AboutSection.tsx',
  services: 'components/ServicesSection.tsx',
  projects: 'components/ProjectsSection.tsx',
  contact: 'components/ContactSection.tsx',
};

test('hero nav links point at real sections, not "#"', () => {
  const hero = read('components/HeroSection.tsx');
  assert.ok(!/href=["']#["']/.test(hero), 'nav must not use placeholder href="#"');
  for (const id of Object.keys(SECTION_FILES)) {
    assert.ok(hero.includes(`href: '#${id}'`), `nav is missing a link to #${id}`);
  }
});

for (const [id, file] of Object.entries(SECTION_FILES)) {
  test(`${file} renders a section with id="${id}"`, () => {
    const src = read(file);
    assert.ok(
      new RegExp(`<section[^>]*id=["']${id}["']`).test(src),
      `expected <section id="${id}"> in ${file}`,
    );
  });
}

test('every nav href resolves to an existing section id', () => {
  const hero = read('components/HeroSection.tsx');
  const hrefs = [...hero.matchAll(/href:\s*'#([a-z-]+)'/g)].map((m) => m[1]);
  assert.ok(hrefs.length >= 4, 'expected at least the four nav links');
  const allSections = Object.values(SECTION_FILES).map(read).join('\n');
  for (const h of hrefs) {
    assert.ok(
      new RegExp(`<section[^>]*id=["']${h}["']`).test(allSections),
      `nav link #${h} has no matching section id`,
    );
  }
});

test('ContactButton is a working anchor to the contact section', () => {
  const btn = read('components/ContactButton.tsx');
  assert.ok(/<a[\s>]/.test(btn), 'ContactButton must render an anchor, not an inert button');
  assert.ok(/href=["']#contact["']/.test(btn), 'ContactButton must link to #contact');
});

test('anchor navigation scrolls smoothly', () => {
  const css = read('index.css');
  assert.ok(/scroll-behavior:\s*smooth/.test(css), 'index.css should enable smooth scrolling');
});
