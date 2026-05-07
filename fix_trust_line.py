import os, re

components_dir = '/sessions/exciting-ecstatic-turing/lbc-work/src/components'

old_patterns = [
    'Free forever&nbsp;&middot;&nbsp;Delivered every Monday morning&nbsp;&middot;&nbsp;No credit card',
    'Free forever&nbsp;&middot;&nbsp;Delivered every Monday&nbsp;&middot;&nbsp;No credit card',
    'weekly event newsletter and full event details',
]
new_text = 'Free forever&nbsp;&middot;&nbsp;No credit card'

changed = []
for root, dirs, files in os.walk(components_dir):
    for fname in files:
        if not fname.endswith('.tsx'):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, 'r') as f:
            content = f.read()
        new_content = content
        for old in old_patterns:
            new_content = new_content.replace(old, new_text)
        if new_content != content:
            with open(fpath, 'w') as f:
                f.write(new_content)
            changed.append(fpath.replace(components_dir + '/', ''))

print(f"Updated {len(changed)} files:")
for f in changed:
    print(f"  {f}")
