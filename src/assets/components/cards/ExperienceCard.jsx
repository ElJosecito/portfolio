import React from 'react'

import { formatDateRange, isEnglish, localizeExperience } from '../../../shared/utils/i18n'

function ExperienceCard({ experience, languaje }) {
    const { title, description } = localizeExperience(experience, languaje)
    const date = formatDateRange(experience.start_date, experience.end_date, languaje)

    return (
        <div className="relative mx-12 pb-12 grid before:absolute before:left-[-35px] before:block before:h-full before:border-l-2 before:border-black/20 dark:before:border-white/15 before:content-[''] md:grid-cols-5 md:gap-10 md:space-x-4">
            <div className="relative pb-12 md:col-span-2">
                <div className="sticky top-0">
                    <span className="text-[#549eff] -left-[42px] absolute rounded-full text-5xl">
                        &bull;
                    </span>
                    <h3 className="text-xl font-bold text-[#549eff]">{title}</h3>
                    <h4 className="font-semibold text-xl text-gray-600 dark:text-white">{experience.company}</h4>
                    <time className="p-0 m-0 text-sm text-gray-600/80 dark:text-white/80">{date}</time>
                </div>
            </div>
            <div className="relative flex flex-col gap-2 pb-4 text-gray-600 dark:text-gray-300 md:col-span-3">
                {description}
                {experience.link && (
                    <a
                        className='flex transition-all duration-200 text-lg font-bold text-[#549eff] hover:opacity-70 '
                        href={experience.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {isEnglish(languaje) ? 'Learn more' : 'Saber más'}
                    </a>
                )}
            </div>
        </div>
    );

}

export default ExperienceCard
