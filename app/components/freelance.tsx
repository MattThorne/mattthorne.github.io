import Link from 'next/link'
import { formatDate, getWorkFreelance } from 'app/resume/utils'

export function Freelance() {
    let allProjects = getWorkFreelance()

    return (
        <div>
            {allProjects
                .sort((a, b) => {
                    if (
                        new Number(a.metadata.order) < new Number(b.metadata.order)
                    ) {
                        return -1
                    }
                    return 1
                })
                .map((project) => (
                    // <Link
                    //     key={project.slug}
                    //     className="flex flex-col space-y-1 mb-4"
                    //     href={`/resume/${project.slug}`}
                    // >
                    <div key={project.slug} className="w-full space-x-0 flex flex-col space-y-0 mb-2">
                        <p className="text-2xl text-neutral-600 dark:text-neutral-300 tracking-tight hover:text-neutral-800 dark:hover:text-neutral-100">
                            {project.metadata.title}
                        </p>
                        <p className=" text-neutral-600 dark:text-neutral-400">
                            {project.metadata.skills}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                            {project.metadata.summary}
                        </p>
                    </div>
                    // </Link>
                ))}
        </div>
    )
}
