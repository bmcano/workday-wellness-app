import React from 'react';
// @ts-ignore
import bronzeFlameImage from "../static/assets/bronzeflame.png";
// @ts-ignore
import silverFlameImage from "../static/assets/silverflame.png";
// @ts-ignore
import goldFlameImage from "../static/assets/goldflame.png";
// @ts-ignore
import bronzeBell from "../static/assets/bronzebell.png";
// @ts-ignore
import silverBell from "../static/assets/silverbell.png";
// @ts-ignore
import goldBell from "../static/assets/goldbell.png";
// @ts-ignore
import friendbadge from "../static/assets/friendbadge.png";

const Badges: React.FC<any> = ({ achievements }) => {

    return (
        <div>
            {[
                { image: friendbadge, alt: "Make a Friend!", achieved: achievements.MadeFriend },
                { image: bronzeFlameImage, alt: "Streak of One day", achieved: achievements.OneDayStreak },
                { image: silverFlameImage, alt: "Streak of Ten days", achieved: achievements.TenDayStreak },
                { image: goldFlameImage, alt: "Streak of One Hundred days", achieved: achievements.HundredDayStreak },
                { image: bronzeBell, alt: "Completed One Exercise", achieved: achievements.OneDayEx },
                { image: silverBell, alt: "Completed Ten Exercises", achieved: achievements.TenDayEx },
                { image: goldBell, alt: "Completed One Hundred Exercises", achieved: achievements.HundredDayEx }
            ].map((badge, index) => (
                <div key={index} className="image-container">
                    <img
                        src={badge.image}
                        alt={badge.alt}
                        style={{ opacity: badge.achieved ? 1 : 0.3 }}
                    />
                    <span className="image-tooltip">{badge.alt} Achievement</span>
                </div>
            ))}
        </div>
    )
}

export default Badges;