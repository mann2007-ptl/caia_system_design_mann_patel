import React from 'react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, description, actionButton, breadcrumbs }) => {
    return (
        <div className="admin-page-header">
            {breadcrumbs && (
                <div className="admin-breadcrumbs">
                    {breadcrumbs.map((crumb, index) => (
                        <React.Fragment key={index}>
                            {crumb.path ? (
                                <Link to={crumb.path}>
                                    {crumb.label}
                                </Link>
                            ) : (
                                <span>{crumb.label}</span>
                            )}
                            {index < breadcrumbs.length - 1 && (
                                <span className="mx-1">/</span>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
            <div className="admin-page-title-row">
                <div>
                    <h1 className="admin-page-title">{title}</h1>
                    {description && <p className="admin-page-description">{description}</p>}
                </div>
                {actionButton && <div>{actionButton}</div>}
            </div>
        </div>
    );
};

export default PageHeader;

