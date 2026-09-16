import { memo, useEffect, useRef } from "react";

const TWO_PI = Math.PI * 2;

interface Dot {
    ax: number;
    ay: number;
    sx: number;
    sy: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
}

interface DotFieldProps extends React.HTMLAttributes<HTMLDivElement> {
    dotRadius?: number;
    dotSpacing?: number;
    cursorRadius?: number;
    cursorForce?: number;
    bulgeOnly?: boolean;
    bulgeStrength?: number;
    glowRadius?: number;
    sparkle?: boolean;
    waveAmplitude?: number;
    gradientFrom?: string;
    gradientTo?: string;
    glowColor?: string;
}

const DotField = memo(function DotField({
    dotRadius = 1.5,
    dotSpacing = 14,
    cursorRadius = 500,
    cursorForce = 0.1,
    bulgeOnly = true,
    bulgeStrength = 67,
    glowRadius = 160,
    sparkle = false,
    waveAmplitude = 0,
    gradientFrom = "rgba(5, 150, 105, 0.22)",
    gradientTo = "rgba(180, 151, 207, 0.14)",
    glowColor = "#064e3b",
    ...rest
}: DotFieldProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glowRef = useRef<SVGCircleElement>(null);
    const dotsRef = useRef<Dot[]>([]);
    const mouseRef = useRef({ x: -9999, y: -9999, prevX: -9999, prevY: -9999, speed: 0 });
    const rafRef = useRef<number | null>(null);
    const sizeRef = useRef({ w: 0, h: 0, offsetX: 0, offsetY: 0 });
    const glowOpacity = useRef(0);
    const engagement = useRef(0);
    const glowId = useRef(`dot-field-glow-${Math.random().toString(36).slice(2, 9)}`);
    const propsRef = useRef({ dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeOnly, bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo });

    propsRef.current = { dotRadius, dotSpacing, cursorRadius, cursorForce, bulgeOnly, bulgeStrength, sparkle, waveAmplitude, gradientFrom, gradientTo };

    useEffect(() => {
        const canvas = canvasRef.current;
        const glowElement = glowRef.current;
        const parent = canvas?.parentElement;
        const context = canvas?.getContext("2d", { alpha: true });
        if (!canvas || !parent || !context) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        let resizeTimer: ReturnType<typeof setTimeout> | undefined;

        const buildDots = (width: number, height: number) => {
            const { dotRadius: radius, dotSpacing: spacing } = propsRef.current;
            const step = radius + spacing;
            const columns = Math.floor(width / step);
            const rows = Math.floor(height / step);
            const padX = (width % step) / 2;
            const padY = (height % step) / 2;
            const dots: Dot[] = [];

            for (let row = 0; row < rows; row += 1) {
                for (let column = 0; column < columns; column += 1) {
                    const ax = padX + column * step + step / 2;
                    const ay = padY + row * step + step / 2;
                    dots.push({ ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay });
                }
            }

            dotsRef.current = dots;
        };

        const resize = () => {
            if (resizeTimer) clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const rect = parent.getBoundingClientRect();
                canvas.width = rect.width * dpr;
                canvas.height = rect.height * dpr;
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                context.setTransform(dpr, 0, 0, dpr, 0, 0);
                sizeRef.current = { w: rect.width, h: rect.height, offsetX: rect.left + window.scrollX, offsetY: rect.top + window.scrollY };
                buildDots(rect.width, rect.height);
            }, 100);
        };

        const onMouseMove = (event: MouseEvent) => {
            const { offsetX, offsetY } = sizeRef.current;
            mouseRef.current.x = event.pageX - offsetX;
            mouseRef.current.y = event.pageY - offsetY;
        };

        const updateMouseSpeed = () => {
            const mouse = mouseRef.current;
            const distance = Math.hypot(mouse.prevX - mouse.x, mouse.prevY - mouse.y);
            mouse.speed += (distance - mouse.speed) * 0.5;
            if (mouse.speed < 0.001) mouse.speed = 0;
            mouse.prevX = mouse.x;
            mouse.prevY = mouse.y;
        };

        let frameCount = 0;
        const tick = () => {
            frameCount += 1;
            const dots = dotsRef.current;
            const mouse = mouseRef.current;
            const { w: width, h: height } = sizeRef.current;
            const props = propsRef.current;
            const time = frameCount * 0.02;
            const targetEngagement = Math.min(mouse.speed / 5, 1);
            engagement.current += (targetEngagement - engagement.current) * 0.06;
            const currentEngagement = engagement.current;
            glowOpacity.current += (currentEngagement - glowOpacity.current) * 0.08;

            if (glowElement) {
                glowElement.setAttribute("cx", String(mouse.x));
                glowElement.setAttribute("cy", String(mouse.y));
                glowElement.style.opacity = String(glowOpacity.current);
            }

            context.clearRect(0, 0, width, height);
            const gradient = context.createLinearGradient(0, 0, width, height);
            gradient.addColorStop(0, props.gradientFrom);
            gradient.addColorStop(1, props.gradientTo);
            context.fillStyle = gradient;
            context.beginPath();

            const cursorRadiusSquared = props.cursorRadius * props.cursorRadius;
            const radius = props.dotRadius / 2;

            for (let index = 0; index < dots.length; index += 1) {
                const dot = dots[index];
                const dx = mouse.x - dot.ax;
                const dy = mouse.y - dot.ay;
                const distanceSquared = dx * dx + dy * dy;

                if (distanceSquared < cursorRadiusSquared && currentEngagement > 0.01) {
                    const distance = Math.sqrt(distanceSquared);
                    const angle = Math.atan2(dy, dx);
                    if (props.bulgeOnly) {
                        const push = (1 - distance / props.cursorRadius) ** 2 * props.bulgeStrength * currentEngagement;
                        dot.sx += (dot.ax - Math.cos(angle) * push - dot.sx) * 0.15;
                        dot.sy += (dot.ay - Math.sin(angle) * push - dot.sy) * 0.15;
                    } else {
                        const move = (500 / Math.max(distance, 1)) * (mouse.speed * props.cursorForce);
                        dot.vx -= Math.cos(angle) * move;
                        dot.vy -= Math.sin(angle) * move;
                    }
                } else if (props.bulgeOnly) {
                    dot.sx += (dot.ax - dot.sx) * 0.1;
                    dot.sy += (dot.ay - dot.sy) * 0.1;
                }

                if (!props.bulgeOnly) {
                    dot.vx *= 0.9;
                    dot.vy *= 0.9;
                    dot.x = dot.ax + dot.vx;
                    dot.y = dot.ay + dot.vy;
                    dot.sx += (dot.x - dot.sx) * 0.1;
                    dot.sy += (dot.y - dot.sy) * 0.1;
                }

                let drawX = dot.sx;
                let drawY = dot.sy;
                if (props.waveAmplitude > 0) {
                    drawY += Math.sin(dot.ax * 0.03 + time) * props.waveAmplitude;
                    drawX += Math.cos(dot.ay * 0.03 + time * 0.7) * props.waveAmplitude * 0.5;
                }

                const sparkleRadius = props.sparkle && ((((index * 2654435761) ^ (frameCount >> 3)) >>> 0) % 100 < 3) ? radius * 1.8 : radius;
                context.moveTo(drawX + sparkleRadius, drawY);
                context.arc(drawX, drawY, sparkleRadius, 0, TWO_PI);
            }

            context.fill();
            rafRef.current = requestAnimationFrame(tick);
        };

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", onMouseMove, { passive: true });
        const speedInterval = window.setInterval(updateMouseSpeed, 20);
        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            window.clearInterval(speedInterval);
            if (resizeTimer) clearTimeout(resizeTimer);
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", onMouseMove);
        };
    }, []);

    useEffect(() => {
        const { w: width, h: height } = sizeRef.current;
        if (!width || !height) return;
        const { dotRadius: radius, dotSpacing: spacing } = propsRef.current;
        const step = radius + spacing;
        const columns = Math.floor(width / step);
        const rows = Math.floor(height / step);
        const padX = (width % step) / 2;
        const padY = (height % step) / 2;
        dotsRef.current = Array.from({ length: rows * columns }, (_, index) => {
            const column = index % columns;
            const row = Math.floor(index / columns);
            const ax = padX + column * step + step / 2;
            const ay = padY + row * step + step / 2;
            return { ax, ay, sx: ax, sy: ay, vx: 0, vy: 0, x: ax, y: ay };
        });
    }, [dotRadius, dotSpacing]);

    return (
        <div className="pointer-events-none h-full w-full" {...rest}>
            <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
            <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
                <defs>
                    <radialGradient id={glowId.current}>
                        <stop offset="0%" stopColor={glowColor} />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
                <circle ref={glowRef} cx="-9999" cy="-9999" r={glowRadius} fill={`url(#${glowId.current})`} style={{ opacity: 0 }} />
            </svg>
        </div>
    );
});

DotField.displayName = "DotField";

export default DotField;