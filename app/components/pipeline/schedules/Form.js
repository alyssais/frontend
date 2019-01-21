/* @flow */
import React from 'react';
import Relay from 'react-relay/classic';

import FormCheckbox from 'app/components/shared/FormCheckbox';
import FormTextField from 'app/components/shared/FormTextField';
import FormTextarea from 'app/components/shared/FormTextarea';
import ValidationErrors from 'app/lib/ValidationErrors';

type Props = {
  cronline?: string,
  label?: string,
  commit?: string,
  branch?: string,
  message?: string,
  enabled?: boolean,
  env?: string,
  errors?: Array<any>,
  pipeline: { defaultBranch: string }
};

class Form extends React.Component {
  props: Props;

  static defaultProps = {
    enabled: true
  };

  componentDidMount() {
    this.labelTextField.focus();
  }

  render() {
    const errors = new ValidationErrors(this.props.errors);

    return (
      <div>
        <FormTextField
          label="Description"
          help="The description for the schedule (supports :emoji:)"
          required={true}
          errors={errors.findForField("label")}
          defaultValue={this.props.label}
          ref={(labelTextField) => this.labelTextField = labelTextField}
        />

        <FormTextField
          label="Cron Interval"
          help={<span>The interval for when builds will be created, in UTC, using crontab format. See the <a className="lime" href="/docs/builds/scheduled-builds">Scheduled Builds</a> documentation for more information and examples.</span>}
          required={true}
          errors={errors.findForField("cronline")}
          defaultValue={this.props.cronline}
          ref={(cronlineTextField) => this.cronlineTextField = cronlineTextField}
        />

        <FormTextField
          label="Build Message"
          help="The message to use for the build."
          errors={errors.findForField("message")}
          defaultValue={this.props.message || "Scheduled build"}
          required={true}
          ref={(messageTextField) => this.messageTextField = messageTextField}
        />

        <FormTextField
          label="Build Commit"
          help="The commit ref to use for the build."
          errors={errors.findForField("commit")}
          defaultValue={this.props.commit || "HEAD"}
          required={true}
          ref={(commitTextField) => this.commitTextField = commitTextField}
        />

        <FormTextField
          label="Build Branch"
          help="The branch to use for the build."
          errors={errors.findForField("branch")}
          defaultValue={this.props.branch || this.props.pipeline.defaultBranch}
          required={true}
          ref={(branchTextField) => this.branchTextField = branchTextField}
        />

        <FormTextarea.Autosize
          label="Build Environment Variables"
          help={<span>The environment variables to use for the build, each on a new line. e.g. <code>FOO=bar</code></span>}
          className="input"
          rows={2}
          errors={errors.findForField("env")}
          defaultValue={this.props.env}
          ref={(envTextField) => this.envTextField = envTextField}
        />

        <FormCheckbox
          label="Enabled"
          help="Whether the schedule should run."
          errors={errors.findForField("enabled")}
          defaultChecked={this.props.enabled}
          ref={(enabledCheckbox) => this.enabledCheckbox = enabledCheckbox}
        />
      </div>
    );
  }

  getFormData() {
    return {
      cronline: this.cronlineTextField.value,
      label: this.labelTextField.value,
      message: this.messageTextField.value,
      commit: this.commitTextField.value,
      branch: this.branchTextField.value,
      enabled: this.enabledCheckbox._checkbox.checked, // ugh, I'm sorry
      env: this.envTextField.value
    };
  }
}

export default Relay.createContainer(Form, {
  fragments: {
    pipeline: () => Relay.QL`
      fragment on Pipeline {
        defaultBranch
      }
    `
  }
});
