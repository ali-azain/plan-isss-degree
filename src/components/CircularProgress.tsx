import { motion } from 'framer-motion';

interface CircularProgressProps {
    value: number;
    max: number;
    size?: number;
    strokeWidth?: number;
}

export function CircularProgress({ value, max, size = 200, strokeWidth = 14 }: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const safeValue = Math.min(Math.max(value, 0), max);
    const percent = max > 0 ? (safeValue / max) * 100 : 0;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative flex items-center justify-center font-mono" style={{ width: size, height: size }}>
            {/* Background Circle */}
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full drop-shadow-md">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-muted/30"
                />
                {/* Glow Filter */}
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Animated Progress Circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    filter="url(#glow)"
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        {percent >= 100 ? (
                            <>
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="#10b981" />
                            </>
                        ) : (
                            <>
                                <stop offset="0%" stopColor="#6366f1" />
                                <stop offset="50%" stopColor="#8b5cf6" />
                                <stop offset="100%" stopColor="#d946ef" />
                            </>
                        )}
                    </linearGradient>
                </defs>
            </svg>

            {/* Inner Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="text-4xl font-extrabold tracking-tight text-foreground"
                >
                    {safeValue}
                </motion.span>
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1"
                >
                    / {max} ECTS
                </motion.span>
            </div>
        </div>
    );
}
