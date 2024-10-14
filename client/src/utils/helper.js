// Icon Imports
import CodepenIcon from "../assets/svg/CodepenIcon";
import CodewarsIcon from "../assets/svg/CodewarsIcon";
import DevtoIcon from "../assets/svg/DevtoIcon";
import FacebookIcon from "../assets/svg/FacebookIcon";
import FreeCodeCampIcon from "../assets/svg/FreeCodeCampIcon";
import FrontendMentorIcon from "../assets/svg/FrontendMentorIcon";
import GitHubIcon from "../assets/svg/GitHubIcon";
import GitLabIcon from "../assets/svg/GitLabIcon";
import HashnodeIcon from "../assets/svg/HashnodeIcon";
import LinkedInIcon from "../assets/svg/LinkedInIcon";
import StackOverflowIcon from "../assets/svg/StackOverflowIcon";
import TwitchIcon from "../assets/svg/TwitchIcon";
import TwitterIcon from "../assets/svg/TwitterIcon";
import YouTubeIcon from "../assets/svg/YouTubeIcon";

// Function to get the platform icon based on the platform name
export const getPlatformIcon = (platform, className, color) => {
    switch (platform) {
        case "GitHub":
            return <GitHubIcon className={className} color={color} />;
        case "Frontend Mentor":
            return <FrontendMentorIcon className={className} color={color} />;
        case "Twitter":
            return <TwitterIcon className={className} color={color} />;
        case "LinkedIn":
            return <LinkedInIcon className={className} color={color} />;
        case "YouTube":
            return <YouTubeIcon className={className} color={color} />;
        case "Facebook":
            return <FacebookIcon className={className} color={color} />;
        case "Twitch":
            return <TwitchIcon className={className} color={color} />;
        case "Dev.to":
            return <DevtoIcon className={className} color={color} />;
        case "Codewars":
            return <CodewarsIcon className={className} color={color} />;
        case "Codepen":
            return <CodepenIcon className={className} color={color} />;
        case "freeCodeCamp":
            return <FreeCodeCampIcon className={className} color={color} />;
        case "GitLab":
            return <GitLabIcon className={className} color={color} />;
        case "Hashnode":
            return <HashnodeIcon className={className} color={color} />;
        case "Stack Overflow":
            return <StackOverflowIcon className={className} color={color} />;
        default:
            return null; // Or a default icon if you want
    }
};

// Function to generate the match expression (URL prefix) based on the platform name
export const generateMatchExp = (platform) => {
    switch (platform) {
        case "GitHub":
            return 'https://github.com/';

        case "Frontend Mentor":
            return 'https://www.frontendmentor.io/profile/';

        case "Twitter":
            return 'https://twitter.com/';

        case "LinkedIn":
            return 'https://www.linkedin.com/in/';

        case "YouTube":
            return 'https://www.youtube.com/channel/';

        case "Facebook":
            return 'https://www.facebook.com/';

        case "Twitch":
            return 'https://www.twitch.tv/';

        case "Dev.to":
            return 'https://dev.to/';

        case "Codewars":
            return 'https://www.codewars.com/users/';

        case "Codepen":
            return 'https://codepen.io/';

        case "freeCodeCamp":
            return 'https://www.freecodecamp.org/';

        case "GitLab":
            return 'https://gitlab.com/';

        case "Hashnode":
            return 'https://hashnode.com/';

        case "Stack Overflow":
            return 'https://stackoverflow.com/users/';

        default:
            return '';
    }
};

// Function to generate background color based on platform
export const generateBackgroundColor = (platform) => {
    switch (platform) {
        case "GitHub":
            return '#1A1A1A';
        case "Frontend Mentor":
            return '#FFFFFF';
        case "Twitter":
            return '#43B7E9';
        case "LinkedIn":
            return '#2D68FF';
        case "YouTube":
            return '#EE3939';
        case "Facebook":
            return '#2442AC';
        case "Twitch":
            return '#EE3FC8';
        case "Dev.to":
            return '#333333';
        case "Codewars":
            return '#8A1A50';
        case "Codepen":
            return '#333333';
        case "freeCodeCamp":
            return '#302267';
        case "GitLab":
            return '#EB4925';
        case "Hashnode":
            return '#0330D1';
        case "Stack Overflow":
            return '#EC7100';
        default:
            return 'transparent'; // Default color
    }
};

