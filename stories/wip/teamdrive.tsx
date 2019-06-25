import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Button, Snackbar } from './../../src/ui';
import SnackbarsQueue from './../snackbarsQueue';

const Story = () => {
    const queueRef = React.useRef(null);
    const triggerQueueAddSnackbar = () => {
        queueRef.current.AddSnackbar();
    }

    const [progressHook, setProgressHook] = React.useState(0);
    const [s] = React.useState<any>({});
    const [getProgressHook] = React.useState(() => () => s.progressHook);
    s.progressHook = progressHook;
    const [intervalHook, setIntervalHook] = React.useState(null);

    React.useEffect(() => {
        let unmounted = false;
        setIntervalHook(setInterval(() => {
            if (unmounted) return;
            let progress = (getProgressHook() >= 100) ? 0 : getProgressHook() + 1;
            setProgressHook(progress);
        }, 100));

        return () => {
            unmounted = true;
            clearInterval(intervalHook);
        };
    }, []);

    return (
        <div className="page">
            <section className="snackbars">
                <h2>Promt</h2>
                <Snackbar
                    variant="promt"
                    text={'It may take some time'}
                    title={'We will move your board'}
                    buttons={[
                        {
                            text: 'Start',
                            isPrimary: true,
                            onTimer: true
                        },
                        {
                            text: 'Cancel'
                        }
                    ]}
                />
            </section>

            <section className="snackbars">
                <h2>Progress</h2>
                <Snackbar
                    title="We are moving your board"
                    text="It may take some time"
                    buttons={[
                        {
                            progress: progressHook,
                            text: progressHook + '%'
                        }
                    ]}
                />
            </section>

            <section className="snackbars">
                <h2>Success</h2>
                <Snackbar
                    variant="success"
                    text = "Teamdrive long name Lorem ipsum / Board long name Lorem ipsum"
                    title = "Board has been moved"
                    buttons={[
                        {
                            text: 'Ok'
                        }
                    ]}
                />
            </section>

            <SnackbarsQueue ref={queueRef} />
        </div>
    );
};

storiesOf('WIP', module)
    .add('TeamDrive', () => <Story />);
