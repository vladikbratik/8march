import { chapters } from '../data/employees.js';
import { persons }  from '../data/persons.js';

function renderPerson(person) {
  const hasPage = Boolean(persons[person.slug]);
  const inner = `
      <div class="person-card__photo">
        <img
          src="/assets/photos/${person.photo}"
          alt="${person.name}"
          loading="lazy"
          onerror="this.style.display='none'"
        />
      </div>
      <div class="person-card__info">
        <h3 class="person-card__name">${person.name}</h3>
        <p class="person-card__dedication">${person.dedication}</p>
        ${hasPage ? '<span class="person-card__link-hint">смотреть →</span>' : ''}
      </div>`;

  if (hasPage) {
    return `
    <a class="person-card person-card--linked" data-slug="${person.slug}" href="/person.html?slug=${person.slug}">
      ${inner}
    </a>`;
  }
  return `
    <div class="person-card" data-slug="${person.slug}">
      ${inner}
    </div>`;
}

function renderChapter(chapter) {
  const soloClass = chapter.solo ? ' credits__chapter--solo' : '';
  return `
    <div class="credits__chapter${soloClass}" data-chapter="${chapter.numeral}">
      <div class="chapter__header">
        <div class="chapter__divider"></div>
        <div class="chapter__title-group">
          <span class="chapter__numeral">${chapter.numeral}</span>
          <h2 class="chapter__title">${chapter.title}</h2>
        </div>
        <div class="chapter__divider"></div>
      </div>
      <div class="chapter__cards">
        ${chapter.people.map(renderPerson).join('')}
      </div>
    </div>`;
}

export function renderCredits() {
  const container = document.getElementById('credits-chapters');
  if (!container) return;
  container.innerHTML = chapters.map(renderChapter).join('');
}
